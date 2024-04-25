import { useEffect, useMemo } from 'react'
import { Canvas, useImage, Image, Group } from '@shopify/react-native-skia'
import { useWindowDimensions } from 'react-native'
import {
  useSharedValue,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  useFrameCallback,
  interpolate,
  useDerivedValue,
  Extrapolation
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
  PIPE_HEIGHT,
  PIPE_WIDTH,
  VELOCITY_ON_TAP
} from './store'

//TODO Check safe area view
//TODO Check pipes between offset

const App = () => {
  const { width, height } = useWindowDimensions()
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
  const bg = useImage(require('./assets/sprites/background-day.png'))
  const bird = useImage(require('./assets/sprites/yellowbird-upflap.png'))
  const pipeBottom = useImage(require('./assets/sprites/pipe-green.png'))
  const pipeTop = useImage(require('./assets/sprites/pipe-green-top.png'))
  const baseGround = useImage(require('./assets/sprites/base.png'))

  const pipeTranslateYOffset = 0
  const pipeBetweenOffset = 200

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

  const gesture = useMemo(() => {
    return Gesture.Tap().onStart(() => {
      birdYVelocity.value = VELOCITY_ON_TAP
    })
  })

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt) return
    //Animate bird position
    birdY.value = birdY.value + birdYVelocity.value * dt * 0.001
    birdYVelocity.value = birdYVelocity.value + GRAVITY * dt * 0.001
  })

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ width, height, backgroundColor: 'red' }}>
          <Image image={bg} fit={'cover'} width={width} height={height} />

          {/* Pipes */}
          <Image
            image={pipeTop}
            y={pipeTranslateYOffset - PIPE_HEIGHT / 2 + pipeBetweenOffset}
            x={pipeX}
            width={PIPE_WIDTH}
            height={PIPE_HEIGHT}
          />
          <Image
            image={pipeTop}
            y={
              pipeTranslateYOffset -
              PIPE_HEIGHT / 2 -
              pipeBetweenOffset +
              pipeBetweenOffset -
              100
            }
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
              pipeBetweenOffset
            }
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
              pipeBetweenOffset +
              pipeBetweenOffset +
              100
            }
            x={pipeX}
            width={PIPE_WIDTH}
            height={PIPE_HEIGHT}
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

          {/* Ground */}
          <Image
            image={baseGround}
            fit={'cover'}
            width={width}
            height={GROUND_HEIGHT}
            y={height - GROUND_HEIGHT / 2}
            x={0}
          />
        </Canvas>
      </GestureDetector>
    </GestureHandlerRootView>
  )
}

export default App
