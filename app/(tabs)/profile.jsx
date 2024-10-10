import { View, TouchableOpacity, Image, Text, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons, images } from '../../constants'
import InfoBox from '../../components/InfoBox'
import ProfileImage from '../../components/ProfileImage'
import GiftLogs from '../../components/GiftLogs'
import { router } from 'expo-router'

const Profile = () => {
  const { user, signOut } = useGlobalContext()

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center items-center mt-6 px-4">
          <View className="w-full items-end mb-10 flex-row justify-end space-x-8">
            <TouchableOpacity onPress={() => router.push('/settings')}>
              <Image
                source={icons.settings}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={signOut}>
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
          </View>
          <ProfileImage avatar={user?.avatar} styles={'border-2 w-20 h-20'} />
          <InfoBox
            title={user?.username}
            containerStyles="mt-5"
            titleStyles="text-lg capitalize"
          />
          <View className="mt-5 flex-row">
            <InfoBox
              title={user?.score}
              subtitle="Score"
              containerStyles="mr-10"
              titleStyles="text-xl"
            />
            <InfoBox
              title={user?.gifts}
              subtitle="Gifts"
              titleStyles="text-xl"
              containerStyles="mr-10"
            />
            <InfoBox
              title={user?.copters}
              subtitle="Copters"
              titleStyles="text-xl"
            />
          </View>
        </View>
        <GiftLogs />
        <StatusBar style="light" backgroundColor="#161622" />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
