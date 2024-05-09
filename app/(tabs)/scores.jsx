import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import ScoresList from '../../components/ScoresList'

const Scores = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScoresList />
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default Scores
