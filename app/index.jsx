import { StatusBar } from 'expo-status-bar'
import { Link, Redirect, router } from 'expo-router'
import { View, Text, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../constants'
import CustomButton from '../components/CustomButton'
import { useGlobalContext } from '../context/GlobalProvider'

export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full min-h-[85vh] items-center justify-center px-4">
          <Image
            source={images.logoLg}
            resizeMode="contain"
            className="w-[170px] h-[84px]"
          />
          <Image
            source={images.cards}
            resizeMode="contain"
            className="max-w-[380px] w-full h-[300px]"
          />
          <View className="mt-5 relative">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Joyful Surprises with{' '}
              <Text className="text-secondary-200">exFriend</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Unleash joy and heartfelt surprises with exFriend. Let's make every
            day feel like a birthday celebration!
          </Text>
          <CustomButton
            title={'Continue with Email'}
            handlePress={() => router.push('/sign-in')}
            containerStyles={'w-full mt-7'}
          />
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}
