import { View, Text } from 'react-native'
import React, { useState } from 'react'
import FormField from '../FormField'
import CustomButton from '../CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { useMutation } from '@tanstack/react-query'
import { sendReview } from '../../utils/service'
import { useHandleError } from '../../hooks/useHandleError'
import { withSnackBar } from '../../hoc/withSnackBar'

const ReviewForm = ({ setVisibleSnackBar }) => {
  const { user } = useGlobalContext()
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (review) => sendReview(review),
    onSuccess
  })
  useHandleError(isError, error, setVisibleSnackBar)
  const [form, setForm] = useState({
    title: '',
    message: ''
  })

  function validateFields() {
    const { title, message } = form
    let isValid = true

    if (!title) {
      setVisibleSnackBar('Please enter your subject.')
      isValid = false
      return isValid
    }

    if (!message) {
      setVisibleSnackBar('Please enter your message.')
      isValid = false
      return isValid
    }

    return isValid
  }

  function onSuccess() {
    setVisibleSnackBar(
      'Feedback Received! 🌟 \nThank you for sharing your thoughts.',
      'Success'
    )
    setForm({
      title: '',
      message: ''
    })
  }

  function handleSubmit() {
    if (validateFields()) {
      mutate({ ...form, userId: user._id })
    }
  }

  return (
    <View className="px-4">
      <FormField
        title={'Title/Subject'}
        value={form.title}
        handleChangeText={(e) => setForm({ ...form, title: e })}
      />
      <FormField
        title={'Your Message:'}
        value={form.message}
        handleChangeText={(e) => setForm({ ...form, message: e })}
        otherStyles={'mt-5'}
        multiline={true}
        inputWrapperStyles={'h-40 items-start'}
        textInputStyles={'h-40'}
        inputStyle={{ verticalAlign: 'top' }}
        numberOfLines={6}
      />
      <CustomButton
        title={'Send'}
        handlePress={handleSubmit}
        containerStyles={'mt-7'}
        isLoading={isPending}
      />
    </View>
  )
}

export default withSnackBar(ReviewForm)
