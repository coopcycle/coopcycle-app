import React, { Component } from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon } from 'native-base'
import { withTranslation } from 'react-i18next'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AddressAutocomplete from './AddressAutocomplete'
import AddressUtils from '../utils/Address'

const textInputContainerHeight = 54

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#e4022d',
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

class RestaurantSearch extends Component {

  renderButton() {

    const iconName = this.props.defaultValue ? 'times' : 'search'
    const iconSize = this.props.defaultValue ? 24 : 18

    let touchableProps = {}
    if (this.props.defaultValue) {
      touchableProps = {
        ...touchableProps,
        onPress: this.props.onReset,
      }
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 5, paddingLeft: 10, paddingRight: 15 }}>
        <TouchableOpacity
          style={{ marginRight: 15 }}
          { ...touchableProps }>
          <Icon as={ FontAwesome5 } name={ iconName } style={{ color: '#ffffff', fontSize: iconSize }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={ () => AddressUtils.getAddressFromCurrentPosition().then(address => this.props.onSelect(address)) }>
          <Icon as={ MaterialIcons } name="my-location" style={{ color: '#ffffff', fontSize: 24 }} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {

    return (
      <View style={ [ styles.container, { width: this.props.width } ] }>
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
      </View>
    )
  }
}

export default withTranslation()(RestaurantSearch)
