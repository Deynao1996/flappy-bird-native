import { Image, ImageBackground, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import { StatusBar } from 'expo-status-bar'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/GlobalProvider'
import { TARGET_USER_ID } from '../../constants/store'

const Home = () => {
  const { user } = useGlobalContext()

  return (
    <SafeAreaView className="bg-primary h-full w-full relative">
      <ImageBackground
        source={images.bg}
        resizeMode="cover"
        className="justify-between flex-1 py-5"
      >
        <View />
        <View className="gap-20">
          <View className="flex flex-col items-center">
            <Text className="text-lg font-pstart text-white">BE BRAVE!</Text>
            {user?._id === TARGET_USER_ID && (
              <Text className="text-lg font-pstart text-white">
                HAPPY BIRTHDAY
              </Text>
            )}
            <Text className="text-lg font-pstart text-white">AND</Text>
          </View>
          <View className="flex justify-between items-center flex-col">
            <View>
              <Image
                source={images.intro}
                className="w-[375px] h-[240px]"
                resizeMode="contain"
              />
            </View>
          </View>
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

export default Home
