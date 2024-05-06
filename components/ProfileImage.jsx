import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const ProfileImage = ({ avatar, styles }) => {
  return (
    <View
      className={`w-16 h-16 border border-secondary rounded-lg justify-center items-center ${
        avatar ? 'p-0' : 'p-2'
      } ${styles}`}
    >
      <Image
        source={avatar ? avatar : icons.profile}
        className={`w-full h-full rounded-lg`}
        resizeMode="cover"
      />
    </View>
  )
}

export default ProfileImage
