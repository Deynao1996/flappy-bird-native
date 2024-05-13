import { View, TouchableOpacity, Image } from 'react-native'
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
import * as ImagePicker from 'expo-image-picker'
import { icons } from '../../constants'
import { uploadImageToCloudinary } from '../../utils/upload-image'

const SettingsForm = ({ setVisibleSnackBar }) => {
  const { user, setUser } = useGlobalContext()
  const { mutate, isError, error } = useMutation({
    mutationFn: ({ userId, data }) => updateUser({ userId, data }),
    onSuccess,
    onError: () => setIsLoading(false)
  })
  useHandleError(isError, error, setVisibleSnackBar)
  const [form, setForm] = useState({
    email: user?.email || '',
    username: user?.username || '',
    oldPassword: '',
    newPassword: '',
    avatar: user?.avatar
  })
  const [isLoading, setIsLoading] = useState(false)
  const isClearBtnDisabled = !form.avatar

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

  async function openPicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        allowsEditing: true,
        quality: 1
      })

      if (!result.canceled) {
        setForm({ ...form, avatar: result.assets[0].uri })
      }
    } catch (e) {
      setVisibleSnackBar('Failed to open image picker.')
    }
  }

  function clearImage() {
    setForm({ ...form, avatar: undefined })
  }

  async function onSuccess() {
    const { newPassword, oldPassword, ...rest } = form
    setIsLoading(false)
    setUser((user) => ({ ...user, ...rest }))
    setVisibleSnackBar('Profile updated.', 'Success')
  }

  async function uploadImage(avatar) {
    let res
    try {
      res = await uploadImageToCloudinary(avatar)
    } catch (error) {
      res = undefined
      setVisibleSnackBar('Failed to upload image.')
    }
    return res
  }

  async function handleSubmit() {
    if (validateFields()) {
      setIsLoading(true)

      let avatar
      if (form.avatar && form.avatar === user.avatar) {
        avatar = undefined
      } else if (!form.avatar) {
        avatar = ''
      } else {
        avatar = await uploadImage(form.avatar)
      }

      mutate({
        userId: user._id,
        data: {
          email: form.email,
          password: form.oldPassword || undefined,
          username: form.username,
          newPassword: form.newPassword || undefined,
          avatar
        }
      })
    }
  }

  return (
    <View className="p-4 pt-0">
      <View className="flex justify-center items-center space-y-2">
        <ProfileImage
          avatar={form.avatar}
          styles={'border-2 border-white w-28 h-28'}
        />
        <View className="flex-row justify-center items-center">
          <CustomButton
            title={'Upload Image'}
            handlePress={openPicker}
            containerStyles={
              'my-4 border min-h-[45px] border-secondary bg-primary px-4 rounded-md mr-4'
            }
            textStyles={'text-white text-sm'}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={clearImage}
            className={`border border-red-500 min-h-[45px] justify-center items-center px-4 rounded-md opacity-${
              isClearBtnDisabled ? '30' : '100'
            }`}
            disabled={isClearBtnDisabled}
          >
            <Image
              source={icons.clear}
              className={'w-5 h-5'}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <FormField
        title={'Username:'}
        value={form.username}
        handleChangeText={(e) => setForm({ ...form, username: e })}
        textInputStyles={'capitalize'}
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
        isLoading={isLoading}
      />
    </View>
  )
}

export default withSnackBar(SettingsForm)
