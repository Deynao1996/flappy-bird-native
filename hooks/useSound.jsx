import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'

export const useSound = (asset) => {
  const [sound, setSound] = useState()

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(asset)
    setSound(sound)

    await sound.playAsync()
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  return { playSound }
}
