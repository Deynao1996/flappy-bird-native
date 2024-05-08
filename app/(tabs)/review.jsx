import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Header from '../../components/Header'
import { Alert, ScrollView, View } from 'react-native'
import FormField from '../../components/FormField'
import { useGlobalContext } from '../../context/GlobalProvider'
import CustomButton from '../../components/CustomButton'
import { useMutation } from '@tanstack/react-query'
import { sendReview } from '../../utils/service'
import { useHandleError } from '../../hooks/useHandleError'

const Review = () => {
  const { user } = useGlobalContext()
  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: (review) => sendReview(review),
    onSuccess
  })
  useHandleError(isError, error)
  const [form, setForm] = useState({
    title: '',
    message: ''
  })

  function validateFields() {
    const { title, message } = form
    let isValid = true

    if (!title) {
      Alert.alert('Validation Error', 'Please enter your subject.')
      isValid = false
    }

    if (!message) {
      Alert.alert('Validation Error', 'Please enter your message.')
      isValid = false
    }

    return isValid
  }

  function onSuccess() {
    Alert.alert(
      'Review Submitted! 🌟',
      'Thank you for your review! We value your feedback and will use it to improve our app. Enjoy!'
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
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <Header
          title={'Feedback'}
          subtitle={
            "Share your thoughts, suggestions, and any bugs you've encountered below"
          }
        />
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
      </ScrollView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default Review
