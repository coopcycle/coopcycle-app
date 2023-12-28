import React, { Component } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Center, ChevronDownIcon, Heading, Icon, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { primaryColor, whiteColor } from '../styles/common';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const textInputContainerHeight = 54

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    //TODO: color
    backgroundColor: primaryColor,
    ...Platform.select({
      android: {
        flex: 1,
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
      },
      ios: {
        top: 0,
        left: 0,
        zIndex: 10,
        overflow: 'visible',
      },
    }),
  },
})

function RestaurantSearch(props) {

  const navigation = useNavigation()

  return (
    <View style={ [ styles.container, { width: props.width } ] }>
      <TouchableNativeFeedback onPress={() => {
        navigation.navigate('AccountAddresses', { action: 'search' })
      }}>
        <Center px="2">
          <Text fontSize={'md'} numberOfLines={ 1 } style={{
            color: whiteColor,
          }}>{ props.defaultValue?.streetAddress }</Text>
          <ChevronDownIcon color={ whiteColor }/>
        </Center>
      </TouchableNativeFeedback>
    </View>
  )
}

export default withTranslation()(RestaurantSearch)
