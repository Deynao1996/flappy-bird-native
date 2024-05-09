import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../FormField'
import CustomButton from '../CustomButton'
import { Link } from 'expo-router'
import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../../utils/service'
import { useHandleError } from '../../hooks/useHandleError'
import { EMAIL_REGEX } from '../../constants/store'
import { withSnackBar } from '../../hoc/withSnackBar'

const SignUpForm = ({ setVisibleSnackBar }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (user) => registerUser(user),
    onSuccess
  })
  useHandleError(isError, error, setVisibleSnackBar)

  function validateFields() {
    const { email, password, username } = form
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

    if (!username || !username.trim()) {
      setVisibleSnackBar('Please enter your username.')
      isValid = false
      return isValid
    }

    return isValid
  }

  function onSuccess() {
    setForm({
      username: '',
      email: '',
      password: ''
    })
    setVisibleSnackBar(
      'Your account has been created. Please sign in.',
      'Success'
    )
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
  )
}

export default withSnackBar(SignUpForm)
