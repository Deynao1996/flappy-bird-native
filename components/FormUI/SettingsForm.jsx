import { View, Text } from 'react-native'
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

const SettingsForm = ({ setVisibleSnackBar }) => {
  const { user } = useGlobalContext()
  const { signIn } = useGlobalContext()
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (userId, data) => updateUser({ userId, data }),
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
    return true
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

  async function onSuccess(data) {
    return
    if (!data.data) return
    if (data.data.isBan) return setVisibleSnackBar('You are banned!')
    await saveTokenToStorage(data.data.accessToken)
    signIn(data.data)
  }

  function handleSubmit() {
    if (validateFields()) {
      return
      mutate({
        email: form.email.trim(),
        password: form.password.trim()
      })
    }
  }

  return (
    <View className="p-4">
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
        title={'New password:'}
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
