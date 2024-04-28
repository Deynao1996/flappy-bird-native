import { Image, useImage } from '@shopify/react-native-skia'
import { GROUND_HEIGHT } from '../../constants/store'

const Ground = ({ width, height }) => {
  const baseGround = useImage(require('../../assets/sprites/base.png'))

  return (
    <Image
      image={baseGround}
      fit={'cover'}
      width={width}
      height={GROUND_HEIGHT}
      y={height - GROUND_HEIGHT / 2}
      x={0}
    />
  )
}

export default Ground
