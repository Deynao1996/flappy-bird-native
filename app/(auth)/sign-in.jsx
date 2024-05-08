import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { loginUser } from '../../utils/service'
import { useMutation } from '@tanstack/react-query'
import { useHandleError } from '../../hooks/useHandleError'
import { useGlobalContext } from '../../context/GlobalProvider'
import { EMAIL_REGEX } from '../../constants/store'
// import { useGlobalContext } from '../../context/GlobalProvider'

const SignIn = () => {
  const { signIn } = useGlobalContext()
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (user) => loginUser(user),
    onSuccess
  })
  useHandleError(isError, error)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  function validateFields() {
    const { email, password } = form
    let isValid = true

    if (!email || !email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.')
      isValid = false
    } else if (!EMAIL_REGEX.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.')
      isValid = false
    }

    if (!password || password.trim().length < 5) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 5 characters long.'
      )
      isValid = false
    }

    return isValid
  }

  function onSuccess(data) {
    if (!data.data) return
    if (data.data.isBan) return Alert.alert('Error', 'You are banned!')
    signIn(data.data)
  }

  function handleSubmit() {
    if (validateFields()) {
      mutate({
        email: form.email.trim(),
        password: form.password.trim()
      })
    }
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
            isLoading={isPending}
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
