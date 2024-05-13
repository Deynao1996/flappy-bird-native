import { View, Text, Image } from 'react-native'
import React from 'react'
import { icons } from '../constants'

const ProfileImage = ({ avatar, styles }) => {
  return (
    <View
      className={`w-16 h-16 border-0 border-secondary rounded-lg justify-center items-center ${
        avatar ? 'p-0' : 'p-3 border'
      } ${styles}`}
    >
      <Image
        source={avatar ? { uri: avatar } : icons.noAvatar}
        className={`w-full h-full rounded-md`}
        resizeMode="cover"
      />
    </View>
  )
}

export default ProfileImage
