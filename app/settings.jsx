import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { StatusBar } from 'expo-status-bar'
import SettingsForm from '../components/FormUI/SettingsForm'
import { icons } from '../constants'
import { router } from 'expo-router'

const UserSettings = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="my-6 px-4 space-y-6">
          <View className="flex justify-between items-center mb-6 flex-row-reverse">
            <Text className="text-2xl font-psemibold text-white">
              User Settings
            </Text>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image
                source={icons.leftArrow}
                className="w-6 h-6"
                resizeMode="contain"
                tintColor={'white'}
              />
            </TouchableOpacity>
          </View>
        </View>
        <SettingsForm />
      </ScrollView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default UserSettings
