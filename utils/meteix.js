import { Dimensions, PixelRatio } from 'react-native'
const { fontScale } = Dimensions.get('window')

const { width, height } = Dimensions.get('window')
const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const horizontalScale = (size) => (width / guidelineBaseWidth) * size

const verticalScale = (size) => (height / guidelineBaseHeight) * size

const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor

export const scaleFont = (size) => size * fontScale

export const theme = (lightThemeColor, darkThemeColor, property) => {
  const styles = {}

  const state = ''
  styles[property] = state ? darkThemeColor : lightThemeColor

  return styles
}

const dimensions = (property, top, right = top, bottom = top, left = right) => {
  const styles = {}

  styles[`${property}Top`] = top
  styles[`${property}Right`] = right
  styles[`${property}Bottom`] = bottom
  styles[`${property}Left`] = left

  return styles
}

export function margin(top, right, bottom, left) {
  return dimensions('margin', top, right, bottom, left)
}

export function padding(top, right, bottom, left) {
  return dimensions('padding', top, right, bottom, left)
}

export { horizontalScale, verticalScale, moderateScale }

const widthBaseScale = width / 375
const heightBaseScale = height / 812

function normalize(size, based = 'width') {
  const newSize =
    based === 'height' ? size * heightBaseScale : size * widthBaseScale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

//for width  pixel
const widthPixel = (size) => normalize(size, 'width')
//for height  pixel
const heightPixel = (size) => normalize(size, 'height')
//for font  pixel
const fontPixel = (size) => heightPixel(size)
//for Margin and Padding vertical pixel
const pixelSizeVertical = (size) => heightPixel(size)
//for Margin and Padding horizontal pixel
const pixelSizeHorizontal = (size) => widthPixel(size)
export {
  widthPixel,
  heightPixel,
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal
}
