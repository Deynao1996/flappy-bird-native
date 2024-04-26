import { useEffect, useMemo, useState } from 'react'
import {
  Canvas,
  useImage,
  Image,
  Group,
  Text,
  matchFont,
  Fill
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
  runOnJS
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
  const defaultX = width + 50

  //Animated values
  const pipeX = useSharedValue(defaultX)
  const birdY = useSharedValue(height / 3)
  const birdYVelocity = useSharedValue(0)
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
    x: width / 4 + BIRD_WIDTH / 2,
    y: birdY.value + BIRD_HEIGHT / 2
  }))

  // Importing assets
  const bg = useImage(require('./assets/sprites/background-night.png'))
  const bird = useImage(require('./assets/sprites/yellowbird-upflap.png'))
  const pipeBottom = useImage(require('./assets/sprites/pipe-bottom.png'))
  const pipeTop = useImage(require('./assets/sprites/pipe-top.png'))
  const baseGround = useImage(require('./assets/sprites/base.png'))

  const pipeTranslateYOffset = -30

  const gesture = useMemo(() => {
    return Gesture.Tap().onStart(() => {
      birdYVelocity.value = VELOCITY_ON_TAP
    })
  })

  function animatePipesPosition() {
    pipeX.value = withRepeat(
      withSequence(
        withTiming(-100, {
          duration: ANIMATION_DURATION,
          easing: Easing.linear
        }),
        withTiming(defaultX, { duration: 0 })
      ),
      -1
    )
  }

  useEffect(() => {
    animatePipesPosition()
  }, [])

  useAnimatedReaction(
    () => pipeX.value,
    (currentValue, previousValue) => {
      //Increase counter score on the edge
      const edge = width / 4
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

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt) return
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
                y={pipeTranslateYOffset - PIPE_HEIGHT / 2 + PIPE_BETWEEN_OFFSET}
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
                  x={width / 4}
                  width={BIRD_WIDTH}
                  height={BIRD_HEIGHT}
                />
              </Group>

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
