import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { useHandleError } from '../../hooks/useHandleError'
import { registerUser } from '../../utils/service'
import { EMAIL_REGEX } from '../../constants/store'

const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (user) => registerUser(user),
    onSuccess
  })
  useHandleError(isError, error)

  function validateFields() {
    const { email, password, username } = form
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

    if (!username || !username.trim()) {
      Alert.alert('Validation Error', 'Please enter your username.')
      isValid = false
    }

    return isValid
  }

  function onSuccess() {
    setForm({
      username: '',
      email: '',
      password: ''
    })
    Alert.alert('Success!', 'Your account has been created. Please sign in.', [
      {
        text: 'Close',
        style: 'cancel'
      },
      { text: 'Sign In', onPress: () => router.push('/sign-in') }
    ])
  }

  function handleSubmit() {
    if (validateFields()) {
      mutate({
        email: form.email.trim(),
        password: form.password,
        username: form.username
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
            Sign up to
          </Text>
          <FormField
            title={'Username'}
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-6"
          />
          <FormField
            title={'Email'}
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-6"
            keyboardType="email-address"
          />
          <FormField
            title={'Password'}
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-6"
          />
          <CustomButton
            title="Sign Up"
            handlePress={handleSubmit}
            containerStyles={'mt-6'}
            isLoading={isPending}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-md text-gray-100 font-pregular">
              Have an account?
            </Text>
            <Link
              href={'/sign-in'}
              className="text-md font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp
