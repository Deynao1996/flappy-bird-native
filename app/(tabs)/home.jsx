import { Image, ImageBackground, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'

const home = () => {
  return (
    <SafeAreaView className="bg-primary h-full w-full relative">
      <ImageBackground
        source={images.bg}
        resizeMode="cover"
        className="justify-between flex-1 py-5"
      >
        <View className="flex justify-between items-center flex-col">
          <Image
            source={images.intro}
            className="w-[375px] h-[475px] fixed inset-0 z-10"
            resizeMode="cover"
          />
        </View>
        <View className="px-5">
          <CustomButton
            title={"Let's play!"}
            handlePress={() => router.push('/game')}
            containerStyles={'w-full mt-7'}
            textStyles={'font-pstart text-sm tracking-tighter'}
          />
        </View>
      </ImageBackground>
      <StatusBar style="light" backgroundColor="#18504c" />
    </SafeAreaView>
  )
}

export default home
