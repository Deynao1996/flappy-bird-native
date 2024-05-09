import { View, Text, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'

const Header = ({ title, subtitle, showLogo = true }) => {
  return (
    <View className="my-6 px-4 space-y-6">
      <View className="justify-between items-start flex-row mb-6">
        <View>
          <View className="flex justify-between items-center flex-row">
            <Text className="text-2xl font-psemibold text-white">{title}</Text>
            {showLogo && (
              <Image
                source={images.logo}
                className="w-12 h-12"
                resizeMode="contain"
              />
            )}
          </View>
          {subtitle && (
            <Text className="font-pmedium text-sm text-gray-100 mt-5 text-justify">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </View>
  )
}

export default Header
