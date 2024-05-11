import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import FormField from '../FormField'
import { useGlobalContext } from '../../context/GlobalProvider'
import { EMAIL_REGEX } from '../../constants/store'
import { updateUser } from '../../utils/service'
import { useHandleError } from '../../hooks/useHandleError'
import CustomButton from '../CustomButton'
import { withSnackBar } from '../../hoc/withSnackBar'
import { useMutation } from '@tanstack/react-query'
import ProfileImage from '../ProfileImage'
import { router } from 'expo-router'

const SettingsForm = ({ setVisibleSnackBar }) => {
  const { user, signOut } = useGlobalContext()
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: ({ userId, data }) => updateUser({ userId, data }),
    onSuccess
  })
  useHandleError(isError, error, setVisibleSnackBar)
  const [form, setForm] = useState({
    email: user?.email || '',
    username: user?.username || '',
    oldPassword: '',
    newPassword: ''
  })

  function validateFields() {
    const { email, oldPassword, username, newPassword } = form
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

    if (!username || !username.trim()) {
      setVisibleSnackBar('Please enter your username.')
      isValid = false
      return isValid
    }

    if (oldPassword && oldPassword.trim().length < 5) {
      setVisibleSnackBar('Current Password must be at least 5 characters long.')
      isValid = false
      return isValid
    }

    if (newPassword && newPassword.trim().length < 5) {
      setVisibleSnackBar('New Password must be at least 5 characters long.')
      isValid = false
      return isValid
    }

    if (oldPassword && !newPassword) {
      setVisibleSnackBar('Please enter your new password.')
      isValid = false
      return isValid
    }

    if (newPassword && !oldPassword) {
      setVisibleSnackBar('Please enter your old password.')
      isValid = false
      return isValid
    }

    return isValid
  }

  async function onSuccess() {
    Alert.alert('Success', 'To see updated data, please sign in again.', [
      {
        text: 'Ok',
        onPress: () => {
          signOut()
          router.replace('/sign-in')
        }
      }
    ])
  }

  function handleSubmit() {
    if (validateFields()) {
      mutate({
        userId: user._id,
        data: {
          email: form.email,
          password: form.oldPassword || undefined,
          username: form.username,
          newPassword: form.newPassword || undefined
        }
      })
    }
  }

  return (
    <View className="p-4 pt-0">
      <View className="flex justify-center items-center space-y-2">
        <ProfileImage
          avatar={user?.avatar}
          styles={'border-2 border-white w-28 h-28'}
        />
        <CustomButton
          title={'Upload Image'}
          containerStyles={
            'my-4 border min-h-[45px] border-secondary bg-primary px-4 rounded-md'
          }
          textStyles={'text-white text-sm'}
        />
      </View>
      <FormField
        title={'Username:'}
        value={form.username}
        handleChangeText={(e) => setForm({ ...form, username: e })}
      />
      <FormField
        title={'Email:'}
        value={form.email}
        handleChangeText={(e) => setForm({ ...form, email: e })}
        otherStyles="mt-5"
        keyboardType="email-address"
      />
      <FormField
        title={'Old Password:'}
        value={form.oldPassword}
        placeholder={'******'}
        handleChangeText={(e) => setForm({ ...form, oldPassword: e })}
        otherStyles="mt-5"
      />
      <FormField
        title={'New Password:'}
        value={form.newPassword}
        placeholder={'******'}
        handleChangeText={(e) => setForm({ ...form, newPassword: e })}
        otherStyles="mt-5"
      />
      <CustomButton
        title={'Save Changes'}
        handlePress={handleSubmit}
        containerStyles={'mt-7'}
        isLoading={isPending}
      />
    </View>
  )
}

export default withSnackBar(SettingsForm)
