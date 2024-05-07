import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { loginUser } from '../../utils/service'
// import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  // const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    try {
      const res = await loginUser(form)
      console.log(res.data)
      // console.log(res.data)
    } catch (error) {
      // console.log(error)
    }
    //TODO Add functionality
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center px-4 my-6">
          <Image
            source={images.logoLg}
            className="w-[170px] h-[84px]"
            resizeMode="contain"
          />
          <Text className="text-2xl text-white font-psemibold mt-10">
            Sign In
          </Text>
          <FormField
            title={'Email'}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
          <FormField
            title={'Password'}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={handleSubmit}
            containerStyles={'mt-7'}
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-md text-gray-100 font-pregular">
              Do not have an account?
            </Text>
            <Link
              href={'/sign-up'}
              className="text-md font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
