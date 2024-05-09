import { View, TouchableOpacity, Image, Text } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons, images } from '../../constants'
import InfoBox from '../../components/InfoBox'
import CustomButton from '../../components/CustomButton'
import ProfileImage from '../../components/ProfileImage'
import { TARGET_USER_ID } from '../../constants/store'

//TODO Check user settings
//TODO Check policy
//TODO Internet connection

const Profile = () => {
  const { user, signOut } = useGlobalContext()

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center items-center mt-6 px-4">
        <TouchableOpacity className="w-full items-end mb-10" onPress={signOut}>
          <Image
            source={icons.logout}
            resizeMode="contain"
            className="w-6 h-6"
          />
        </TouchableOpacity>
        <ProfileImage avatar={user?.avatar} styles={'border-2 w-20 h-20'} />
        <InfoBox
          title={user.username}
          containerStyles="mt-5"
          titleStyles="text-lg"
        />
        <View className="mt-5 flex-row">
          <InfoBox
            title={user.score}
            subtitle="Score"
            containerStyles="mr-10"
            titleStyles="text-xl"
          />
          <InfoBox
            title={user.gifts}
            subtitle="Gifts"
            titleStyles="text-xl"
            containerStyles="mr-10"
          />
          <InfoBox
            title={user.copters}
            subtitle="Copters"
            titleStyles="text-xl"
          />
        </View>
      </View>
      {TARGET_USER_ID === user._id ? (
        <View className="justify-center items-center p-5">
          <Image
            source={images.hb}
            className="w-[270px] h-[215px]"
            resizeMode="contain"
          />
          <Text className="text-xl font-psemibold text-white mt-2 text-center">
            Happy Birthday! 🎉
          </Text>
          <Text className="font-pmedium text-sm text-gray-100 text-center mt-4">
            Wishing you the happiest of birthdays! I hope you enjoyed it to the
            fullest!
          </Text>
        </View>
      ) : (
        <View className="justify-center items-center px-4">
          <Image
            source={images.empty}
            className="w-[270px] h-[215px]"
            resizeMode="contain"
          />
          <Text className="text-xl font-psemibold text-white mt-4 text-center">
            No information provided by user
          </Text>
          <Text className="font-pmedium text-sm text-gray-100">
            No Information Found
          </Text>
        </View>
      )}
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default Profile
