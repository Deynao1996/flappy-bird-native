import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { useGlobalContext } from '../../context/GlobalProvider'
import Score from '../../components/Score'
import Header from '../../components/Header'
import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../../utils/service'
import { useHandleError } from '../../hooks/useHandleError'

const Scores = () => {
  const { user } = useGlobalContext()
  const [refreshing, setRefreshing] = useState(false)
  const { data, isError, error, refetch, isLoading } = useQuery({
    queryKey: ['scores'],
    queryFn: fetchUsers
  })
  useHandleError(isError, error)

  async function handleRefresh() {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={data?.data}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Score user={item} index={index} isOwner={user?._id === item._id} />
        )}
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
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator
              animating={true}
              color={'#FFA001'}
              size={'large'}
            />
          ) : (
            <View className="flex justify-center items-center h-full">
              <Text className="text-white font-pbold text-2xl">
                No Scores Found
              </Text>
            </View>
          )
        }
      />
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default Scores
