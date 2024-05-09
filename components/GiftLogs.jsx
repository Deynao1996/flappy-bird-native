import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import Accordion from 'react-native-collapsible/Accordion'
import { GIFT_WISHES } from '../constants/store'
import Header from './Header'
import { icons } from '../constants'
import { useGlobalContext } from '../context/GlobalProvider'

const GiftLogs = () => {
  const { user } = useGlobalContext()
  const [activeSections, setActiveSections] = useState([])

  const giftScore = user?.gifts

  const renderHeader = (section, index, isActive) => {
    const num = index + 1
    const rotationArrowStyles = isActive ? 'rotate-90' : ''
    const isBlockedGift = num > giftScore

    return (
      <View className="my-1 flex flex-row justify-between items-center px-4">
        {!isBlockedGift ? (
          <>
            <Text className="text-lg text-white font-pregular">
              {num + '. ' + section.title}
            </Text>
            <View>
              <Image
                source={icons.down}
                resizeMode="contain"
                tintColor={'white'}
                className={`w-6 h-6 ${rotationArrowStyles}`}
              />
            </View>
          </>
        ) : (
          <>
            <Text className="text-lg text-gray-500 font-pregular">
              {num + '. ' + 'Unlock to see more'}
            </Text>
            <View>
              <Image
                source={icons.lock}
                resizeMode="contain"
                tintColor={'grey'}
                className={`w-6 h-6 ${rotationArrowStyles}`}
              />
            </View>
          </>
        )}
      </View>
    )
  }

  const renderContent = (section) => {
    return (
      <View className="px-4 pb-2 border-t border-gray-300">
        <Text className="font-plight text-sm text-gray-100 mt-5 text-justify">
          {section.description}
        </Text>
      </View>
    )
  }

  const updateSections = (activeSections) => {
    if (activeSections.length) {
      const activeIndex = activeSections[0]
      if (activeIndex + 1 > giftScore) return
    }
    setActiveSections(activeSections)
  }

  return (
    <View className="py-4 mt-5">
      <Text className="text-2xl font-psemibold text-white text-center mb-5">
        Gift Logs
      </Text>
      <Accordion
        sections={GIFT_WISHES}
        activeSections={activeSections}
        underlayColor="#544e4d"
        renderHeader={renderHeader}
        renderContent={renderContent}
        onChange={updateSections}
      />
    </View>
  )
}

export default GiftLogs
