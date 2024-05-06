import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import Header from '../../components/Header'
import { ScrollView, View } from 'react-native'
import FormField from '../../components/FormField'
import { useGlobalContext } from '../../context/GlobalProvider'
import CustomButton from '../../components/CustomButton'

const Review = () => {
  const { user } = useGlobalContext()
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    message: null
  })

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
            handlePress={() => ({})}
            containerStyles={'mt-7'}
          />
        </View>
      </ScrollView>
      <StatusBar style="light" backgroundColor="#161622" />
    </SafeAreaView>
  )
}

export default Review
