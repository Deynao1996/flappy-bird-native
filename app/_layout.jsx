import { useEffect, useMemo } from 'react'
import {
  Canvas,
  useImage,
  Image,
  Group,
  Text,
  matchFont,
  LinearGradient,
  vec
} from '@shopify/react-native-skia'
import { Platform, useWindowDimensions } from 'react-native'
import {
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  useFrameCallback,
  interpolate,
  useDerivedValue,
  Extrapolation,
  useAnimatedReaction,
  runOnJS,
  cancelAnimation
} from 'react-native-reanimated'
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture
} from 'react-native-gesture-handler'
import {
  ANIMATION_DURATION,
  BIRD_HEIGHT,
  BIRD_WIDTH,
  GRAVITY,
  GROUND_HEIGHT,
  PIPE_BETWEEN_OFFSET,
  PIPE_END_RANGE,
  PIPE_HEIGHT,
  PIPE_LEFT_EDGE,
  PIPE_START_RANGE,
  PIPE_WIDTH,
  SCORE_GRADIENT_VIBRANT,
  VELOCITY_ON_TAP
} from '../constants/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Ground from '../components/CanvasUI/Ground'
import { getRange } from '../utils/utils'
import { useSound } from '../hooks/useSound'

//TODO Check alert to user

//Font settings
const fontFamily = Platform.select({ ios: 'Helvetica', default: 'sans-serif' })
const fontStyle = {
  fontFamily,
  fontSize: 40,
  fontWeight: 'bold'
}
const font = matchFont(fontStyle)

const App = () => {
  const { width, height } = useWindowDimensions()

  // Importing visual assets
  const bg = useImage(require('../assets/sprites/background-night.png'))
  const bird = useImage(require('../assets/sprites/yellowbird-upflap.png'))
  const pipeBottom = useImage(require('../assets/sprites/pipe-bottom.png'))
  const pipeTop = useImage(require('../assets/sprites/pipe-top.png'))

  // Importing audio assets
  const { playSound: playHitSound } = useSound(
    require('../assets/audio/hit.wav')
  )
  const { playSound: playPointSound } = useSound(
    require('../assets/audio/point.wav')
  )

  //Default values
  const defaultPipePosX = width + 50
  const defaultBirdYPosition = height / 3
  const defaultBirdXPosition = width / 4

  //Animated values
  const pipeX = useSharedValue(defaultPipePosX)
  const birdY = useSharedValue(defaultBirdYPosition)
  const birdYVelocity = useSharedValue(0)
  const gameOver = useSharedValue(false)
  const pipeYOffset = useSharedValue(-30)

  //Derived values
  const score = useSharedValue(0)
  const textValue = useDerivedValue(() => score.value.toString())
  const centerScoreText = useDerivedValue(() => {
    const textWidth = font.getTextWidth(textValue.value)
    return width / 2 - textWidth / 2
  })
  const bottomPipeY = useDerivedValue(
    () => height - PIPE_HEIGHT / 2 + pipeYOffset.value - PIPE_BETWEEN_OFFSET
  )
  const topPipeY = useDerivedValue(
    () => pipeYOffset.value - PIPE_HEIGHT / 2 + PIPE_BETWEEN_OFFSET
  )
  const speedCoefficient = useDerivedValue(() => {
    return interpolate(score.value, [0, 20], [1, 2])
  })
  const birdTransform = useDerivedValue(() => {
    return [
      {
        rotate: interpolate(
          birdYVelocity.value,
          [VELOCITY_ON_TAP, -VELOCITY_ON_TAP],
          [-0.5, 0.5],
          Extrapolation.CLAMP
        )
      }
    ]
  })
  const birdOrigin = useDerivedValue(() => ({
    x: defaultBirdXPosition + BIRD_WIDTH / 2,
    y: birdY.value + BIRD_HEIGHT / 2
  }))
  const obstacles = useDerivedValue(() => {
    const defaultSettings = {
      x: pipeX.value,
      h: PIPE_HEIGHT,
      w: PIPE_WIDTH
    }
    return [
      {
        ...defaultSettings,
        y: bottomPipeY.value
      },
      {
        ...defaultSettings,
        y: topPipeY.value
      }
    ]
  })

  const gesture = useMemo(() => {
    return Gesture.Tap().onStart(() => {
      if (gameOver.value) {
        //Restart game
        birdY.value = defaultBirdYPosition
        birdYVelocity.value = 0
        gameOver.value = false
        pipeX.value = defaultPipePosX
        score.value = 0
        runOnJS(animatePipesPosition)()
      } else {
        birdYVelocity.value = VELOCITY_ON_TAP
      }
    })
  })

  function animatePipesPosition() {
    pipeX.value = withSequence(
      withTiming(defaultPipePosX, { duration: 0 }),
      withTiming(PIPE_LEFT_EDGE, {
        duration: ANIMATION_DURATION / speedCoefficient.value,
        easing: Easing.linear
      }),
      withTiming(defaultPipePosX, { duration: 0 })
    )
  }

  function isPointCollidingWithRect(point, rect) {
    'worklet'
    return (
      point.x >= rect.x && //Right of the left edge
      point.x <= rect.x + rect.w && //Left of the right edge
      point.y >= rect.y && //Below the top edge
      point.y <= rect.y + rect.h //Above the bottom edge
    )
  }

  useEffect(() => {
    animatePipesPosition()
  }, [])

  //Score detection
  useAnimatedReaction(
    () => pipeX.value,
    (currentValue, previousValue) => {
      //Change position for the position of next gap
      if (
        previousValue &&
        currentValue <= PIPE_LEFT_EDGE &&
        previousValue >= PIPE_LEFT_EDGE
      ) {
        pipeYOffset.value = getRange(PIPE_START_RANGE, PIPE_END_RANGE)
        cancelAnimation(pipeX)
        runOnJS(animatePipesPosition)()
      }

      //Increase counter score on the edge
      const edge = defaultBirdXPosition
      if (
        currentValue !== previousValue &&
        previousValue &&
        currentValue <= edge &&
        previousValue > edge
      ) {
        runOnJS(playPointSound)()
        score.value = score.value + 1
      }
    }
  )

  //Collision detection
  useAnimatedReaction(
    () => birdY.value,
    (currentValue) => {
      //Ground collision detection
      if (
        currentValue > height - GROUND_HEIGHT / 2 - BIRD_HEIGHT ||
        currentValue < 0
      ) {
        // runOnJS(playDieSound)()
        gameOver.value = true
      }

      //Pipes collision detection
      const center = {
        x: defaultBirdXPosition + BIRD_WIDTH / 2,
        y: birdY.value + BIRD_HEIGHT / 2
      }
      const isColliding = obstacles.value.some((rect) =>
        isPointCollidingWithRect(center, rect)
      )
      if (isColliding) {
        // runOnJS(playHitSound)()
        gameOver.value = true
      }
    }
  )

  useAnimatedReaction(
    () => gameOver.value,
    (currentValue, previousValue) => {
      if (currentValue && !previousValue) {
        runOnJS(playHitSound)()
        cancelAnimation(pipeX)
      }
    }
  )

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt || gameOver.value) return
    //Animate bird position
    birdY.value = birdY.value + birdYVelocity.value * dt * 0.001
    birdYVelocity.value = birdYVelocity.value + GRAVITY * dt * 0.001
  })

  return (
    <>
      <SafeAreaView>
        <GestureHandlerRootView>
          <GestureDetector gesture={gesture}>
            <Canvas style={{ width, height, backgroundColor: 'red' }}>
              <Image image={bg} fit={'cover'} width={width} height={height} />

              {/* Pipes */}
              <Image
                image={pipeTop}
                y={topPipeY}
                x={pipeX}
                width={PIPE_WIDTH}
                height={PIPE_HEIGHT}
              />

              <Image
                image={pipeBottom}
                y={bottomPipeY}
                x={pipeX}
                width={PIPE_WIDTH}
                height={PIPE_HEIGHT}
              />
              <Ground width={width} height={height} />
              {/* Bird */}
              <Group transform={birdTransform} origin={birdOrigin}>
                <Image
                  image={bird}
                  y={birdY}
                  x={defaultBirdXPosition}
                  width={BIRD_WIDTH}
                  height={BIRD_HEIGHT}
                />
              </Group>
              {/* Score */}
              <Text text={textValue} x={centerScoreText} y={100} font={font}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(256, 256)}
                  colors={SCORE_GRADIENT_VIBRANT}
                />
              </Text>
            </Canvas>
          </GestureDetector>
        </GestureHandlerRootView>
        <StatusBar style="light" backgroundColor="black" />
      </SafeAreaView>
    </>
  )
}

export default App
