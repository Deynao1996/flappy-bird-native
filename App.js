import { useEffect, useMemo, useState } from 'react'
import {
  Canvas,
  useImage,
  Image,
  Group,
  Text,
  matchFont,
  Fill,
  Circle
} from '@shopify/react-native-skia'
import { Platform, useWindowDimensions } from 'react-native'
import {
  useSharedValue,
  withTiming,
  withRepeat,
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
  PIPE_HEIGHT,
  PIPE_WIDTH,
  VELOCITY_ON_TAP
} from './store'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'

//TODO Center score text
//TODO Check text color
//TODO Check up border
//TODO Check useState usage
//TODO Add sounds

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
  const [score, setScore] = useState(0)

  //Default values
  const defaultPipePosX = width + 50
  const defaultBirdYPosition = height / 3
  const defaultBirdXPosition = width / 4
  const pipeTranslateYOffset = -30
  const defaultBottomPipeY =
    height - PIPE_HEIGHT / 2 + pipeTranslateYOffset - PIPE_BETWEEN_OFFSET
  const defaultTopPipeY =
    pipeTranslateYOffset - PIPE_HEIGHT / 2 + PIPE_BETWEEN_OFFSET

  //Animated values
  const pipeX = useSharedValue(defaultPipePosX)
  const birdY = useSharedValue(defaultBirdYPosition)
  const birdYVelocity = useSharedValue(0)
  const gameOver = useSharedValue(false)

  //Derived values
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
  const birdCenterY = useDerivedValue(() => birdY.value + BIRD_HEIGHT / 2)
  const birdCenterX = useDerivedValue(
    () => defaultBirdXPosition + BIRD_WIDTH / 2
  )
  const obstacles = useDerivedValue(() => {
    const allObstacles = []
    const defaultSettings = {
      x: pipeX.value,
      h: PIPE_HEIGHT,
      w: PIPE_WIDTH
    }

    allObstacles.push({
      ...defaultSettings,
      y: defaultBottomPipeY
    })

    allObstacles.push({
      ...defaultSettings,
      y: defaultTopPipeY
    })
    return allObstacles
  })

  // Importing assets
  const bg = useImage(require('./assets/sprites/background-night.png'))
  const bird = useImage(require('./assets/sprites/yellowbird-upflap.png'))
  const pipeBottom = useImage(require('./assets/sprites/pipe-bottom.png'))
  const pipeTop = useImage(require('./assets/sprites/pipe-top.png'))
  const baseGround = useImage(require('./assets/sprites/base.png'))

  const gesture = useMemo(() => {
    return Gesture.Tap().onStart(() => {
      if (gameOver.value) {
        //Restart game
        birdY.value = defaultBirdYPosition
        birdYVelocity.value = 0
        gameOver.value = false
        pipeX.value = defaultPipePosX
        runOnJS(setScore)(0)
        runOnJS(animatePipesPosition)()
      } else {
        birdYVelocity.value = VELOCITY_ON_TAP
      }
    })
  })

  function animatePipesPosition() {
    pipeX.value = withRepeat(
      withSequence(
        withTiming(-100, {
          duration: ANIMATION_DURATION,
          easing: Easing.linear
        }),
        withTiming(defaultPipePosX, { duration: 0 })
      ),
      -1
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
      //Increase counter score on the edge
      const edge = defaultBirdXPosition
      if (
        currentValue !== previousValue &&
        previousValue &&
        currentValue <= edge &&
        previousValue > edge
      ) {
        runOnJS(setScore)(score + 1)
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
        gameOver.value = true
      }

      const isColliding = obstacles.value.some((rect) =>
        isPointCollidingWithRect(
          {
            x: birdCenterX.value,
            y: birdCenterY.value
          },
          rect
        )
      )
      if (isColliding) {
        gameOver.value = true
      }

      // //Bottom pipe collision detection
      // if (
      //   birdCenterX.value >= pipeX.value && //Right of the left edge
      //   birdCenterX.value <= pipeX.value + PIPE_WIDTH && //Left of the right edge
      //   birdCenterY.value >= defaultBottomPipeY && //Below the top edge
      //   birdCenterY.value <= defaultBottomPipeY + PIPE_HEIGHT //Above the bottom edge
      // ) {
      //   gameOver.value = true
      // }

      // //Top pipe collision detection
      // if (
      //   birdCenterX.value >= pipeX.value && //Right of the left edge
      //   birdCenterX.value <= pipeX.value + PIPE_WIDTH && //Left of the right edge
      //   birdCenterY.value >= defaultTopPipeY && //Below the top edge
      //   birdCenterY.value <= defaultTopPipeY + PIPE_HEIGHT //Above the bottom edge
      // ) {
      //   gameOver.value = true
      // }
    }
  )

  useAnimatedReaction(
    () => gameOver.value,
    (currentValue, previousValue) => {
      if (currentValue && !previousValue) {
        //TODO Check alert to user
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
                y={defaultTopPipeY}
                x={pipeX}
                width={PIPE_WIDTH}
                height={PIPE_HEIGHT}
              />

              <Image
                image={pipeBottom}
                y={
                  height -
                  PIPE_HEIGHT / 2 +
                  pipeTranslateYOffset -
                  PIPE_BETWEEN_OFFSET
                }
                x={pipeX}
                width={PIPE_WIDTH}
                height={PIPE_HEIGHT}
              />

              {/* Ground */}
              <Image
                image={baseGround}
                fit={'cover'}
                width={width}
                height={GROUND_HEIGHT}
                y={height - GROUND_HEIGHT / 2}
                x={0}
              />

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
              {/* <Circle cy={birdCenterY} cx={birdCenterX} r={15} color={'red'} /> */}

              {/* Score */}
              <Text
                text={score.toString()}
                x={width / 2 - 20}
                y={100}
                font={font}
              />
            </Canvas>
          </GestureDetector>
        </GestureHandlerRootView>
        <StatusBar style="light" backgroundColor="black" />
      </SafeAreaView>
    </>
  )
}

export default App
