import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignUpForm from '../../components/FormUI/SignUpForm'

const SignUp = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <SignUpForm />
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
