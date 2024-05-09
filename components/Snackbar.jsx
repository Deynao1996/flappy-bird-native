import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native'

import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical
} from '../utils/meteix'
import icons from '../constants/icons'

const Snackbar = ({
  position = 'Top',
  isVisible,
  message,
  snackBarType,
  duration,
  resetSnackBar,
  actionLabel,
  isPermanent
}) => {
  const fadeAnim = useState(new Animated.Value(0))[0]

  useEffect(() => {
    if (isVisible) {
      showSnackbar() // Leverage the showSnackbar function from the hook
    }
  }, [isVisible])

  const showSnackbar = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      if (!isPermanent) {
        setTimeout(() => {
          hideSnackbar()
        }, duration)
      }
    })
  }

  const hideSnackbar = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true
    }).start(() => {
      resetSnackBar()
    })
  }

  let icon
  switch (snackBarType) {
    case 'Success':
      icon = icons.success
      break
    case 'Failure':
      icon = icons.error
      break
    default:
      icon = icons.error
      break
  }

  return isVisible ? (
    <Animated.View
      style={[
        SnackBarStyle.SnackbarContainer,
        SnackBarStyle[position],
        SnackBarStyle[snackBarType],
        { opacity: fadeAnim }
      ]}
    >
      <View style={SnackBarStyle.SnackbarContentContainer}>
        <View style={SnackBarStyle.IconAndMessageContainer}>
          <Image
            source={icon}
            style={SnackBarStyle.IconStyle}
            tintColor={'#ffffff'}
          />
          {/* {icon} */}
          <View style={SnackBarStyle.MessageContainer}>
            <Text style={SnackBarStyle.MessageText}>{message}</Text>
          </View>
        </View>
        {actionLabel && (
          <TouchableOpacity>
            <Text style={SnackBarStyle.ActionLabel}>{actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  ) : null
}

const SnackBarStyle = StyleSheet.create({
  SnackbarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: pixelSizeHorizontal(12),
    paddingVertical: pixelSizeVertical(16),
    marginHorizontal: pixelSizeHorizontal(16),
    marginVertical: pixelSizeVertical(16),
    borderRadius: 3,
    width: Dimensions.get('screen').width - pixelSizeHorizontal(32)
    // marginBottom: pixelSizeVertical(10),
  },
  Top: {
    top: 0
  },
  Bottom: {
    bottom: 0
  },
  NotificationWithoutIcon: {
    backgroundColor: '#1f243d'
  },
  Success: {
    backgroundColor: '#00C282'
  },
  Failure: {
    backgroundColor: '#fe6c6a'
  },
  Notification: {
    backgroundColor: '#1f243d'
  },
  SnackbarContentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  Offline: {
    backgroundColor: '#fe6c6a'
  },
  IconAndMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 0.9
  },
  MessageContainer: {
    flex: 0.95
  },
  HeaderStyle: {
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: fontPixel(18),
    marginBottom: pixelSizeVertical(9)
  },
  MessageText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: fontPixel(16)
  },
  ActionLabel: {
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    fontSize: fontPixel(16)
  },
  IconStyle: {
    width: pixelSizeHorizontal(24),
    height: pixelSizeVertical(24)
  }
})

export default Snackbar
