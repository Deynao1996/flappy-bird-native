import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Header from '../../components/Header'
import { ScrollView } from 'react-native'
import ReviewForm from '../../components/FormUI/ReviewForm'

const Review = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <Header
          title={'Feedback'}
          subtitle={
            "Share your thoughts, suggestions, and any bugs you've encountered below"
          }
        />
        <ReviewForm />
      </ScrollView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default Review
