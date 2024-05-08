import { View, Text, Image } from 'react-native'
import React from 'react'
import ProfileImage from './ProfileImage'
import { icons } from '../constants'
import { TARGET_USER_ID } from '../constants/store'

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
    <View className="px-4 mb-5">
      <View className="flex flex-row items-center gap-5">
        <View className="basis-6 relative">
          <Text className="text-3xl text-white font-pbold">{currentPlace}</Text>
          {setRelativeImage(currentPlace)}
        </View>
        <View className="flex flex-row gap-x-2">
          <ProfileImage avatar={user?.avatar} styles={isOwner && 'border-2'} />
          <View className="flex flex-row justify-between space-x-4">
            <View className="flex flex-col">
              <Text className="text-white text-md font-psemibold">
                Score: {user.score}
              </Text>
              <Text className="text-gray-100">{user.username}</Text>
            </View>
            <Text className="text-white text-md font-psemibold">
              Copters: {user.copters}
            </Text>
            {user._id === TARGET_USER_ID && (
              <Text className="text-white text-md font-psemibold">
                Gifts: {user.gifts}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default Score
