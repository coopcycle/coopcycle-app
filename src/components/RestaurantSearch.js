import React, { Component } from 'react'
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native'
import {Center, ChevronDownIcon, Heading, Icon, Text} from 'native-base'
import { withTranslation } from 'react-i18next'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AddressAutocomplete from './AddressAutocomplete'
import AddressUtils from '../utils/Address'
import {primaryColor, whiteColor} from '../styles/common';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';

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

  const renderButton = () => {

    const iconName = props.defaultValue ? 'times' : 'search'
    const iconSize = props.defaultValue ? 24 : 18

    let touchableProps = {}
    if (props.defaultValue) {
      touchableProps = {
        ...touchableProps,
        onPress: props.onReset,
      }
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingLeft: 10, paddingRight: 15 }}>
        <TouchableOpacity
          { ...touchableProps }>
          <Icon as={ FontAwesome5 } name={ iconName } style={{ color: '#ffffff', fontSize: 24 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={ () => AddressUtils.getAddressFromCurrentPosition().then(address => props.onSelect(address)) }>
          <Icon as={ MaterialIcons } name="my-location" style={{ color: '#ffffff', fontSize: 24 }} />
        </TouchableOpacity>
      </View>
    )
  }


    //this.props.onSelect

    return (
      <View style={ [ styles.container, { width: props.width } ] }>
          <TouchableNativeFeedback onPress={() => {
            navigation.navigate('AccountAddresses', {onSelect: props.onSelect})
          }}>
            <Center>

            <Text fontSize={'md'} style={{
          color: whiteColor,

        }}>{props.defaultValue?.streetAddress} </Text>
          <ChevronDownIcon color={whiteColor}/>
            </Center>

          </TouchableNativeFeedback>
      </View>
    )
}
/*
<AddressAutocomplete
          location={ this.props.location }
          country={ this.props.country }
          onSelectAddress={ this.props.onSelect }
          containerStyle={{
            flex: 1,
            justifyContent: 'center',
          }}
          inputContainerStyle={{
            flex: 1,
            justifyContent: 'center',
            borderWidth: 0,
            paddingLeft: 15,
            height: textInputContainerHeight,
          }}
          style={{
            height: (textInputContainerHeight * 0.7),
          }}
          onChangeText={ this.props.onChangeText }
          value={ this.props.defaultValue }
          renderRight={ this.renderButton.bind(this) }
          addresses={ this.props.savedAddresses } />
 */
export default withTranslation()(RestaurantSearch)
