import { View, Text, FlatList, Image, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../../context/GlobalProvider'
import Score from '../../components/Score'
import Header from '../../components/Header'

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
          <Header
            title={'Scoreboard'}
            subtitle={
              'Check out the scores of all players below. See how you stack up against others and track your progress over time'
            }
          />
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
