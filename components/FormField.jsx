import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { icons } from '../constants'

const FormField = ({
  title,
  value,
  handleChangeText,
  placeholder,
  otherStyles,
  inputWrapperStyles,
  textInputStyles,
  inputStyle = {},
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const secureTextTiles = ['Password', 'New Password:', 'Old Password:']
  const isSecureText = secureTextTiles.includes(title)

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View
        className={`w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center flex-row ${inputWrapperStyles}`}
      >
        <TextInput
          className={`flex-1 text-white font-psemibold text-base ${textInputStyles}`}
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          placeholderTextColor={'#CDCDE0'}
          secureTextEntry={isSecureText && !showPassword}
          style={inputStyle}
          {...props}
        />
        {isSecureText && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField
