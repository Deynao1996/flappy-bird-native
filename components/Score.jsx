import { View, Text, Image } from 'react-native'
import React from 'react'
import ProfileImage from './ProfileImage'
import { icons } from '../constants'
import { TARGET_USER_ID } from '../constants/store'
import { truncateString } from '../utils/utils'

const PlaceImage = ({ source }) => {
  return (
    <Image
      source={source}
      className="w-5 h-5 absolute -top-3 -right-3.5"
      resizeMode="contain"
    />
  )
}

const Score = ({ user, index, isOwner }) => {
  const currentPlace = index + 1

  function setRelativeImage(currentPlace) {
    switch (currentPlace) {
      case 1:
        return <PlaceImage source={icons.gold} />
      case 2:
        return <PlaceImage source={icons.silver} />
      case 3:
        return <PlaceImage source={icons.bronze} />
      default:
        return null
    }
  }

  return (
    <View className={`px-4 mb-2 py-1 ${isOwner && 'bg-[#222236]'}`}>
      <View className="flex flex-row justify-between">
        <View className="flex-1 flex-row items-center gap-x-5 mr-4">
          <View className="relative basis-6">
            <Text className="text-3xl text-white font-pbold">
              {currentPlace}
            </Text>
            {setRelativeImage(currentPlace)}
          </View>
          <View className="flex flex-row items-center">
            <ProfileImage avatar={user?.avatar} />
            <Text className="text-gray-100 capitalize ml-2 font-pregular">
              {truncateString(user.username, 10)}
            </Text>
          </View>
        </View>
        <View className="flex-1 flex-row justify-end items-center gap-x-4">
          <Text className="text-white text-md font-psemibold flex-1 text-center">
            {user.score}
          </Text>
          <Text className="text-white text-md font-psemibold flex-1 text-center">
            {user.copters}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Score
