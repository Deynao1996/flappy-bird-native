import React from 'react'
import { Canvas, useImage, Image } from '@shopify/react-native-skia'
import { useWindowDimensions } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import {
  BIRD_HEIGHT,
  BIRD_WIDTH,
  GROUND_HEIGHT,
  PIPE_HEIGHT,
  PIPE_WIDTH
} from './store'

const App = () => {
  const { width, height } = useWindowDimensions()

  // Importing assets
  const bg = useImage(require('./assets/sprites/background-day.png'))
  const bird = useImage(require('./assets/sprites/yellowbird-upflap.png'))
  const pipeBottom = useImage(require('./assets/sprites/pipe-green.png'))
  const pipeTop = useImage(require('./assets/sprites/pipe-green-top.png'))
  const baseGround = useImage(require('./assets/sprites/base.png'))

  const pipeTranslateYOffset = 0
  const pipeBetweenOffset = 200

  return (
    <Canvas style={{ width, height, backgroundColor: 'red' }}>
      <Image image={bg} fit={'cover'} width={width} height={height} />

      {/* Pipes */}
      <Image
        image={pipeTop}
        y={pipeTranslateYOffset - PIPE_HEIGHT / 2 + pipeBetweenOffset}
        x={width / 2}
        width={PIPE_WIDTH}
        height={PIPE_HEIGHT}
      />

      <Image
        image={pipeBottom}
        y={height - PIPE_HEIGHT / 2 + pipeTranslateYOffset - pipeBetweenOffset}
        x={width / 2}
        width={PIPE_WIDTH}
        height={PIPE_HEIGHT}
      />

      {/* Bird */}
      <Image
        image={bird}
        y={height / 2}
        x={width / 4}
        width={BIRD_WIDTH}
        height={BIRD_HEIGHT}
      />

      <Image
        image={baseGround}
        fit={'cover'}
        width={width}
        height={GROUND_HEIGHT}
        y={height - GROUND_HEIGHT / 2}
        x={0}
      />

      {/* <StatusBar style="auto" /> */}
    </Canvas>
  )
}

export default App
