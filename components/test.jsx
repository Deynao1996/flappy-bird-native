import {
  Canvas,
  useImage,
  Image,
  Rect,
  LinearGradient,
  vec,
  Group
} from '@shopify/react-native-skia'
import { Link } from 'expo-router'
import { useEffect } from 'react'
import { Alert, useWindowDimensions } from 'react-native'
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture
} from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const { width, height } = useWindowDimensions()
  const bg = useImage(require('../assets/sprites/background-night.png'))
  const over = useImage(require('../assets/sprites/gameover.png'))
  const gameOver = {
    value: false
  }

  const gesture = Gesture.Tap().onStart(() => {
    gameOver.value = !gameOver.value
    console.log(gameOver.value)
  })

  useEffect(() => {
    Alert.alert(
      'Look out!',
      "Hitting reset will wipe all the app's data on your phone. This cannot be undone!",
      [
        {
          text: 'Reset',
          onPress: this._doSomethingSerious,
          style: 'destructive'
        },
        { text: 'Cancel' }
      ],
      { cancelable: false }
    )
  }, [])

  return (
    <SafeAreaView>
      <Link href="modal">Open Modal</Link>
      <GestureHandlerRootView>
        <GestureDetector gesture={gesture}>
          <Canvas style={{ width, height }}>
            <Image image={bg} fit={'cover'} width={width} height={height} />
            <Group opacity={1}>
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                color={'#000000ad'}
              />
              <Image
                image={over}
                fit={'contain'}
                width={192}
                height={42}
                x={width / 2 - 96}
                y={height / 2 - 21}
              />
            </Group>
          </Canvas>
        </GestureDetector>
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

export default Home
