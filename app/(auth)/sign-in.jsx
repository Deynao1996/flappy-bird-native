import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SignInForm from '../../components/FormUI/SignInForm'

const SignIn = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <SignInForm />
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
