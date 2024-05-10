import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../FormField'
import { Link } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '../../utils/service'
import { useHandleError } from '../../hooks/useHandleError'
import { EMAIL_REGEX } from '../../constants/store'
import { useGlobalContext } from '../../context/GlobalProvider'
import CustomButton from '../CustomButton'
import { withSnackBar } from '../../hoc/withSnackBar'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignInForm = ({ setVisibleSnackBar }) => {
  const { signIn } = useGlobalContext()
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (user) => loginUser(user),
    onSuccess
  })
  useHandleError(isError, error, setVisibleSnackBar)
  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  function validateFields() {
    const { email, password } = form
    let isValid = true

    if (!email || !email.trim()) {
      setVisibleSnackBar('Please enter your email address.')
      isValid = false
      return isValid
    } else if (!EMAIL_REGEX.test(email)) {
      setVisibleSnackBar('Please enter a valid email address.')
      isValid = false
      return isValid
    }

    if (!password || password.trim().length < 5) {
      setVisibleSnackBar('Password must be at least 5 characters long.')
      isValid = false
      return isValid
    }

    return isValid
  }

  async function saveTokenToStorage(token) {
    try {
      await AsyncStorage.setItem('token', token)
    } catch (e) {
      console.log(e)
    }
  }

  async function onSuccess(data) {
    if (!data.data) return
    if (data.data.isBan) return setVisibleSnackBar('You are banned!')
    await saveTokenToStorage(data.data.accessToken)
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
    <View className="w-full min-h-[85vh] justify-center px-4 my-6">
      <Image
        source={images.logoLg}
        className="w-[170px] h-[84px]"
        resizeMode="contain"
      />
      <Text className="text-2xl text-white font-psemibold mt-10">Sign In</Text>
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
  )
}

export default withSnackBar(SignInForm)
