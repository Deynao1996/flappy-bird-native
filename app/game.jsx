import { useEffect, useMemo } from 'react'
import {
  Canvas,
  useImage,
  Image,
  Group,
  Text,
  matchFont,
  LinearGradient,
  vec,
  Rect,
  rrect,
  rect,
  Box
} from '@shopify/react-native-skia'
import { Alert, Platform, useWindowDimensions } from 'react-native'
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
  cancelAnimation,
  withDelay
} from 'react-native-reanimated'
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture
} from 'react-native-gesture-handler'
import {
  ANIMATION_DURATION,
  APPEAR_GIFT_STEPS,
  BIRD_HEIGHT,
  BIRD_WIDTH,
  COPTER_ANIMATION_DURATION,
  COPTER_HEIGHT,
  COPTER_LEFT_EDGE,
  COPTER_WIDTH,
  COUNTDOWN_HEIGHT,
  COUNTDOWN_WIDTH,
  GIFT_SCORE_HEIGHT,
  GIFT_SCORE_WIDTH,
  GIFT_SCORE_X,
  GIFT_SCORE_Y,
  GIFT_WISHES,
  GRAVITY,
  GROUND_HEIGHT,
  OVERLAY_COLOR,
  PIPE_BETWEEN_OFFSET,
  PIPE_END_RANGE,
  PIPE_HEIGHT,
  PIPE_LEFT_EDGE,
  PIPE_START_RANGE,
  PIPE_WIDTH,
  SCORE_BOX_COLOR,
  SCORE_BOX_RADIUS,
  SCORE_BOX_WIDTH,
  SCORE_GRADIENT_COOL,
  SCORE_GRADIENT_VIBRANT,
  SCORE_Y,
  SPEER_WIDTH,
  TOTAL_GIFT_SCORE,
  VELOCITY_ON_TAP
} from '../constants/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { generateRandomNumbersArr, getRange } from '../utils/utils'
import { useSound } from '../hooks/useSound'
import { withPause } from 'react-native-redash'
import { router } from 'expo-router'

//TODO check fonts

//Font settings
const scoreFontSize = 40
const fontFamily = Platform.select({ ios: 'Helvetica', default: 'sans-serif' })
const scoreFontStyle = {
  fontFamily,
  fontSize: scoreFontSize,
  fontWeight: 'bold'
}
const giftFontStyle = {
  fontFamily,
  fontSize: 20
}
const scoreFont = matchFont(scoreFontStyle)
const giftFont = matchFont(giftFontStyle)

const App = () => {
  const { width, height } = useWindowDimensions()

  // Importing visual assets
  const bg = useImage(require('../assets/sprites/background-night.png'))
  const bird = useImage(require('../assets/sprites/missile.png'))
  const pipeBottom = useImage(require('../assets/sprites/pipe-bottom.png'))
  const pipeTop = useImage(require('../assets/sprites/pipe-top.png'))
  const over = useImage(require('../assets/sprites/gameover.png'))
  const one = useImage(require('../assets/sprites/1.png'))
  const two = useImage(require('../assets/sprites/2.png'))
  const three = useImage(require('../assets/sprites/3.png'))
  const gift = useImage(require('../assets/sprites/gift.png'))
  const baseGround = useImage(require('../assets/sprites/base.png'))
  const boom = useImage(require('../assets/sprites/boom.png'))
  const copter = useImage(require('../assets/sprites/plane.png'))

  // Importing audio assets
  const { playSound: playHitSound } = useSound(
    require('../assets/audio/hit.wav')
  )
  const { playSound: playPointSound } = useSound(
    require('../assets/audio/point.wav')
  )
  const { playSound: playDieSound } = useSound(
    require('../assets/audio/die.wav')
  )
  const { playSound: playGiftSuccess } = useSound(
    require('../assets/audio/success.wav')
  )
  const { playSound: playShoutSound } = useSound(
    require('../assets/audio/shout.wav')
  )

  //Default values
  const defaultPipePosX = width + 50
  const defaultBirdYPosition = height / 3
  const defaultBirdXPosition = width / 4
  const defaultCopterX = width + 200

  //Shared values
  const score = useSharedValue(0)
  const pipeX = useSharedValue(defaultPipePosX)
  const birdY = useSharedValue(defaultBirdYPosition)
  const birdYVelocity = useSharedValue(0)
  const gameOver = useSharedValue(false)
  const gameOnStop = useSharedValue(true)
  const gameOnPause = useSharedValue(false)
  const pipeYOffset = useSharedValue(-30)
  const gameOverBannerOpacity = useSharedValue(0)
  const countDownOverlayOpacity = useSharedValue(1)
  const translateXCountdownCoefficient = useSharedValue(2)
  const giftScore = useSharedValue(0)
  const touchingWithGift = useSharedValue(false)
  const giftOpacity = useSharedValue(0)
  const groundSecondHalfX = useSharedValue(0)
  const boomOpacity = useSharedValue(0)
  const copterOpacity = useSharedValue(0)
  const copterScore = useSharedValue(0)
  const touchingWithCopterValue = useSharedValue(false)
  const appearCopterSteps = useSharedValue(
    generateRandomNumbersArr(APPEAR_GIFT_STEPS)
  )

  //Derived values
  const scoreTextValue = useDerivedValue(() => score.value.toString())
  const scoreWidth = useDerivedValue(() =>
    scoreFont.getTextWidth(scoreTextValue.value)
  )
  const centerScoreText = useDerivedValue(
    () => width / 2 - scoreWidth.value / 2
  )
  const giftScoreValue = useDerivedValue(
    () => giftScore.value.toString() + ' / ' + TOTAL_GIFT_SCORE.toString()
  )
  const giftScoreWidth = useDerivedValue(
    () => giftFont.getTextWidth(giftScoreValue.value) + 25
  )
  const copterScoreValue = useDerivedValue(() => copterScore.value.toString())
  const centerScoreBox = useDerivedValue(() => {
    const k = score.value >= 10 ? 15 : -10
    return centerScoreText.value - scoreWidth.value / 2 + k
  })
  const groundFirstHalfX = useDerivedValue(
    () => groundSecondHalfX.value + width
  )
  const bottomPipeY = useDerivedValue(
    () => height - PIPE_HEIGHT / 2 + pipeYOffset.value - PIPE_BETWEEN_OFFSET
  )
  const topPipeY = useDerivedValue(
    () => pipeYOffset.value - PIPE_HEIGHT / 2 + PIPE_BETWEEN_OFFSET
  )
  const bottomGiftY = useDerivedValue(
    () => bottomPipeY.value - PIPE_BETWEEN_OFFSET - PIPE_WIDTH / 3
  )
  const speedCoefficient = useDerivedValue(() =>
    interpolate(score.value, [0, 20], [1, 2], Extrapolation.CLAMP)
  )
  const speedTextValue = useDerivedValue(
    () => 'x' + speedCoefficient.value.toFixed(1).toString()
  )
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
  const pipesObstacles = useDerivedValue(() => {
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
  const giftObstacles = useDerivedValue(() => {
    return {
      x: pipeX.value,
      h: PIPE_WIDTH,
      w: PIPE_WIDTH,
      y: bottomGiftY.value
    }
  })
  const transformCountdown = useDerivedValue(() => {
    return [{ translateX: -width * translateXCountdownCoefficient.value }]
  })

  const boomScale = useDerivedValue(() => {
    return [
      {
        scale: interpolate(boomOpacity.value, [0, 1], [1, 2])
      },
      {
        rotate: interpolate(boomOpacity.value, [0, 1], [-1.5, 0])
      }
    ]
  })

  const copterX = useSharedValue(defaultPipePosX)
  const copterOrigin = useDerivedValue(() => ({
    x: copterX.value + COPTER_WIDTH / 2,
    y: bottomGiftY.value + COPTER_HEIGHT / 2
  }))
  const copterObstacles = useDerivedValue(() => {
    return {
      x: copterX.value,
      h: COPTER_HEIGHT,
      w: COPTER_WIDTH,
      y: bottomGiftY.value
    }
  })

  const gesture = useMemo(() => {
    return Gesture.Tap().onStart(() => {
      if (gameOver.value || gameOnStop.value) {
        //Restart game
      } else {
        birdYVelocity.value = VELOCITY_ON_TAP
      }
    })
  })

  function animateCopter() {
    copterOpacity.value = 1
    copterX.value = withPause(
      withSequence(
        withTiming(defaultCopterX, { duration: 0 }),
        withTiming(COPTER_LEFT_EDGE, {
          duration: COPTER_ANIMATION_DURATION / speedCoefficient.value,
          easing: Easing.linear
        }),
        withTiming(defaultCopterX, { duration: 0 })
      ),
      gameOnPause
    )
  }

  function changeOpacityWithOverlap(stepsArr, targetValue) {
    const isOverlap = stepsArr.includes(+scoreTextValue.value)
    if (isOverlap) {
      targetValue.value = 1
    } else {
      targetValue.value = 0
    }
  }

  function animateScene() {
    //Animate pipes
    pipeX.value = withPause(
      withSequence(
        withTiming(defaultPipePosX, { duration: 0 }),
        withTiming(PIPE_LEFT_EDGE, {
          duration: ANIMATION_DURATION / speedCoefficient.value,
          easing: Easing.linear
        }),
        withTiming(defaultPipePosX, { duration: 0 })
      ),
      gameOnPause
    )

    //Animate ground
    groundSecondHalfX.value = withPause(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(-width, {
          duration: ANIMATION_DURATION / speedCoefficient.value,
          easing: Easing.linear
        }),
        withTiming(0, { duration: 0 })
      ),
      gameOnPause
    )

    // Animate copter
    copterX.value = withPause(
      withSequence(
        withTiming(defaultCopterX, { duration: 0 }),
        withTiming(COPTER_LEFT_EDGE, {
          duration: COPTER_ANIMATION_DURATION / speedCoefficient.value,
          easing: Easing.linear
        }),
        withTiming(defaultCopterX, { duration: 0 })
      ),
      gameOnPause
    )

    changeOpacityWithOverlap(APPEAR_GIFT_STEPS, giftOpacity)
    changeOpacityWithOverlap(appearCopterSteps.value, copterOpacity)
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

  function restartGame() {
    birdY.value = defaultBirdYPosition
    birdYVelocity.value = 0
    gameOver.value = false
    pipeX.value = defaultPipePosX
    score.value = 0
    copterScore.value = 0
    gameOverBannerOpacity.value = 0
    countDownOverlayOpacity.value = 1
    boomOpacity.value = 0
    copterX.value = defaultCopterX

    appearCopterSteps.value = generateRandomNumbersArr(APPEAR_GIFT_STEPS)

    //TODO Think about restart
    giftScore.value = 0

    translateXCountdownCoefficient.value = 2
    gameOnStop.value = true
    countDown(() => (gameOnStop.value = false))
  }

  function returnToHomeScreen() {
    router.push('/home')
  }

  function handleThanks() {
    countDown(() => (gameOnPause.value = false))
  }

  function showAlertAfterDelay({
    delay = 1000,
    playSound,
    alertConfig,
    title,
    description
  }) {
    setTimeout(() => {
      playSound?.()
      Alert.alert(title, description, alertConfig)
    }, delay)
  }

  function showScoreAlertAfterDelay() {
    showAlertAfterDelay({
      playSound: playDieSound,
      title: 'Mission Failed! 💥',
      description: `You've reached the end of your flight. But don't worry, you did great! \n\nYour final score: ${scoreTextValue.value} 🎖️\nTotal helicopter destroyed: ${copterScoreValue.value} 🚁`,
      alertConfig: [
        { text: 'Home', onPress: returnToHomeScreen },
        {
          text: 'Try Again',
          onPress: restartGame
        }
      ]
    })
  }

  function showGiftAlertAfterDelay() {
    playGiftSuccess()
    const currentWishedContent = GIFT_WISHES[giftScore.value - 1]
    showAlertAfterDelay({
      delay: 200,
      ...currentWishedContent,
      alertConfig: [{ text: 'Thanks', onPress: handleThanks }]
    })
  }

  function countDown(onFinish) {
    translateXCountdownCoefficient.value = withSequence(
      withTiming(2, { duration: 1000 }),
      withTiming(1, { duration: 1000 }),
      withTiming(0, { duration: 1000 }),
      withTiming(-1, { duration: 1000 })
    )
    countDownOverlayOpacity.value = withDelay(
      3000,
      withTiming(0, { duration: 1000 }, (isFinished) => {
        if (isFinished) {
          runOnJS(onFinish)()
        }
      })
    )
  }

  useEffect(() => {
    countDown(() => (gameOnStop.value = false))
  }, [])

  useAnimatedReaction(
    () => gameOnStop.value,
    (currentValue, previousValue) => {
      if (!currentValue && previousValue) {
        runOnJS(animateScene)()
      }
    }
  )

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
        cancelAnimation(copterX)
        cancelAnimation(groundSecondHalfX)
        runOnJS(animateScene)()
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
      const isCollidingWithPipes = pipesObstacles.value.some((rect) =>
        isPointCollidingWithRect(center, rect)
      )
      if (isCollidingWithPipes) {
        gameOver.value = true
      }

      //Gift collision detection
      const isCollidingWithGift = isPointCollidingWithRect(
        center,
        giftObstacles.value
      )
      if (isCollidingWithGift && giftOpacity.value === 1) {
        touchingWithGift.value = true
        giftOpacity.value = 0
      } else {
        touchingWithGift.value = false
      }

      //Copter collision
      const isCopterCollision = isPointCollidingWithRect(
        center,
        copterObstacles.value
      )
      if (isCopterCollision && copterOpacity.value === 1) {
        touchingWithCopterValue.value = true
        copterOpacity.value = 0
      } else {
        touchingWithCopterValue.value = false
      }
    }
  )

  //Gift score increase
  useAnimatedReaction(
    () => touchingWithGift.value,
    (currentValue, previousValue) => {
      if (!previousValue && currentValue) {
        if (giftScore.value >= TOTAL_GIFT_SCORE) return

        giftScore.value = giftScore.value + 1
        gameOnPause.value = true
        countDownOverlayOpacity.value = withTiming(
          1,
          { duration: 200 },
          (isDone) => {
            if (isDone) {
              runOnJS(showGiftAlertAfterDelay)()
            }
          }
        )
      }
    }
  )

  //Copter score increase
  useAnimatedReaction(
    () => touchingWithCopterValue.value,
    (currentValue, previousValue) => {
      if (!previousValue && currentValue) {
        runOnJS(playHitSound)()
        runOnJS(playShoutSound)()
        copterScore.value = copterScore.value + 1
        boomOpacity.value = withTiming(1.6, { duration: 300 }, (isFinish) => {
          if (isFinish) boomOpacity.value = 0
        })
      }
    }
  )

  useAnimatedReaction(
    () => gameOver.value,
    (currentValue, previousValue) => {
      if (currentValue && !previousValue) {
        //End game
        runOnJS(playHitSound)()
        cancelAnimation(pipeX)
        cancelAnimation(copterX)
        cancelAnimation(groundSecondHalfX)
        boomOpacity.value = withTiming(1, { duration: 100 })
        gameOverBannerOpacity.value = withTiming(
          1,
          { duration: 200 },
          (isDone) => {
            if (isDone) {
              runOnJS(showScoreAlertAfterDelay)()
            }
          }
        )
      }
    }
  )

  useFrameCallback(({ timeSincePreviousFrame: dt }) => {
    if (!dt || gameOver.value || gameOnStop.value || gameOnPause.value) return
    //Animate bird position
    birdY.value = birdY.value + birdYVelocity.value * dt * 0.001
    birdYVelocity.value = birdYVelocity.value + GRAVITY * dt * 0.001
  })

  return (
    <>
      <SafeAreaView>
        <GestureHandlerRootView>
          <GestureDetector gesture={gesture}>
            <Canvas style={{ width, height, backgroundColor: '#18504c' }}>
              {/* Background */}
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
              {/* GIFT */}
              <Image
                image={gift}
                y={bottomGiftY}
                opacity={giftOpacity}
                x={pipeX}
                width={PIPE_WIDTH}
                height={PIPE_WIDTH}
              />
              {/* GROUND */}
              <Group>
                <Image
                  image={baseGround}
                  fit={'cover'}
                  width={width}
                  height={GROUND_HEIGHT}
                  y={height - GROUND_HEIGHT / 2}
                  x={groundFirstHalfX}
                />
                <Image
                  image={baseGround}
                  fit={'cover'}
                  width={width}
                  height={GROUND_HEIGHT}
                  y={height - GROUND_HEIGHT / 2}
                  x={groundSecondHalfX}
                />
              </Group>

              {/* Bird */}
              <Group transform={birdTransform} origin={birdOrigin}>
                <Image
                  image={bird}
                  y={birdY}
                  x={defaultBirdXPosition}
                  width={BIRD_WIDTH}
                  height={BIRD_HEIGHT}
                />
                <Group origin={birdOrigin} transform={boomScale}>
                  <Image
                    image={boom}
                    y={birdY}
                    x={defaultBirdXPosition}
                    width={BIRD_WIDTH}
                    height={BIRD_HEIGHT}
                    opacity={boomOpacity}
                  />
                </Group>
              </Group>

              {/* COPTER */}
              <Group origin={copterOrigin} transform={[{ rotate: -0.25 }]}>
                <Image
                  image={copter}
                  y={bottomGiftY}
                  x={copterX}
                  opacity={copterOpacity}
                  width={COPTER_WIDTH}
                  height={COPTER_HEIGHT}
                />
              </Group>

              {/* GIFT SCORE */}
              <Group>
                <Box
                  box={rrect(
                    rect(
                      GIFT_SCORE_X,
                      GIFT_SCORE_WIDTH / 2 -
                        GIFT_SCORE_HEIGHT / 2 -
                        GIFT_SCORE_Y,
                      GIFT_SCORE_WIDTH,
                      GIFT_SCORE_HEIGHT
                    ),
                    SCORE_BOX_RADIUS / 2,
                    SCORE_BOX_RADIUS / 2
                  )}
                  color={SCORE_BOX_COLOR}
                />
                <Text text={giftScoreValue} x={20} y={50} font={giftFont}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(256, 256)}
                    colors={SCORE_GRADIENT_COOL}
                  />
                </Text>
                <Image
                  image={gift}
                  y={20 + PIPE_WIDTH / 1.5 / 6}
                  x={giftScoreWidth}
                  width={PIPE_WIDTH / 1.5}
                  height={PIPE_WIDTH / 1.5}
                  fit={'contain'}
                />
              </Group>

              {/* COPTER SCORE */}
              <Group>
                <Box
                  box={rrect(
                    rect(
                      GIFT_SCORE_X,
                      GIFT_SCORE_WIDTH / 2 +
                        GIFT_SCORE_HEIGHT / 2 +
                        GIFT_SCORE_Y,
                      GIFT_SCORE_WIDTH,
                      GIFT_SCORE_HEIGHT
                    ),
                    SCORE_BOX_RADIUS / 2,
                    SCORE_BOX_RADIUS / 2
                  )}
                  color={SCORE_BOX_COLOR}
                />
                <Text text={copterScoreValue} x={20} y={100} font={giftFont}>
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(256, 256)}
                    colors={SCORE_GRADIENT_COOL}
                  />
                </Text>
                <Image
                  image={copter}
                  y={70 + PIPE_WIDTH / 1.5 / 6}
                  x={giftScoreWidth}
                  width={PIPE_WIDTH / 1.5}
                  height={PIPE_WIDTH / 1.5}
                  fit={'contain'}
                />
              </Group>

              {/* SPEEDOMETER */}
              <Group>
                <Box
                  box={rrect(
                    rect(
                      width - GIFT_SCORE_X - SPEER_WIDTH,
                      GIFT_SCORE_WIDTH / 2 -
                        GIFT_SCORE_HEIGHT / 2 -
                        GIFT_SCORE_Y,
                      SPEER_WIDTH,
                      GIFT_SCORE_HEIGHT
                    ),
                    SCORE_BOX_RADIUS / 2,
                    SCORE_BOX_RADIUS / 2
                  )}
                  color={SCORE_BOX_COLOR}
                />
                <Text
                  text={speedTextValue}
                  x={width - SPEER_WIDTH + GIFT_SCORE_X}
                  y={50}
                  font={giftFont}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(256, 256)}
                    colors={SCORE_GRADIENT_COOL}
                  />
                </Text>
              </Group>

              {/* Score */}
              <Group>
                <Box
                  box={rrect(
                    rect(
                      centerScoreBox.value,
                      SCORE_Y - SCORE_Y / 2 + 28,
                      SCORE_BOX_WIDTH,
                      SCORE_BOX_WIDTH
                    ),
                    SCORE_BOX_RADIUS,
                    SCORE_BOX_RADIUS
                  )}
                  color={SCORE_BOX_COLOR}
                />
                <Text
                  text={scoreTextValue}
                  x={centerScoreText}
                  y={SCORE_Y}
                  font={scoreFont}
                >
                  <LinearGradient
                    start={vec(0, 0)}
                    end={vec(256, 256)}
                    colors={SCORE_GRADIENT_VIBRANT}
                  />
                </Text>
              </Group>

              {/* Countdown */}
              <Rect
                width={width}
                height={height}
                color={OVERLAY_COLOR}
                opacity={countDownOverlayOpacity}
              />

              <Group transform={transformCountdown}>
                <Image
                  image={one}
                  fit={'contain'}
                  width={COUNTDOWN_WIDTH}
                  height={COUNTDOWN_HEIGHT}
                  x={width / 2 - COUNTDOWN_WIDTH / 2}
                  y={height / 2 - COUNTDOWN_HEIGHT / 2}
                />
                <Image
                  image={two}
                  fit={'contain'}
                  width={COUNTDOWN_WIDTH}
                  height={COUNTDOWN_HEIGHT}
                  x={width / 2 - COUNTDOWN_WIDTH / 2 + width}
                  y={height / 2 - COUNTDOWN_HEIGHT / 2}
                />
                <Image
                  image={three}
                  fit={'contain'}
                  width={COUNTDOWN_WIDTH}
                  height={COUNTDOWN_HEIGHT}
                  x={width / 2 - COUNTDOWN_WIDTH / 2 + width * 2}
                  y={height / 2 - COUNTDOWN_HEIGHT / 2}
                />
              </Group>

              {/* Game Over Banner */}
              <Group opacity={gameOverBannerOpacity}>
                <Rect
                  x={0}
                  y={0}
                  width={width}
                  height={height}
                  color={OVERLAY_COLOR}
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
          <StatusBar style="dark" backgroundColor="#d5d5d5" />
        </GestureHandlerRootView>
      </SafeAreaView>
    </>
  )
}

export default App
