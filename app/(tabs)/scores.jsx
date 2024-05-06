import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../../context/GlobalProvider'
import Score from '../../components/Score'

const users = [
  { _id: '2', username: 'Dmytro', gifts: 0, copters: 4, score: 2 },
  { _id: '1', username: 'Julia', gifts: 5, copters: 10, score: 15 },
  { _id: '3', username: 'John', gifts: 0, copters: 1, score: 6 },
  { _id: '4', username: 'John', gifts: 0, copters: 1, score: 6 }
]

const Scores = () => {
  const [refreshing, setRefreshing] = useState(false)
  const { user } = useGlobalContext()

  async function handleRefresh() {
    // setRefreshing(true)
    // await refetch()
    // setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => <Score user={item} index={index} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <View className="flex justify-between items-center flex-row">
                  <Text className="text-2xl font-psemibold text-white">
                    Scoreboard
                  </Text>
                  <Image
                    source={images.logo}
                    className="w-9 h-10"
                    resizeMode="contain"
                  />
                </View>
                <Text className="font-pmedium text-sm text-gray-100 mt-5 text-justify">
                  Check out the scores of all players below. See how you stack
                  up against others and track your progress over time
                </Text>
              </View>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default Scores
