import React, { Component } from 'react'
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Icon } from 'native-base'
import { withTranslation } from 'react-i18next'
import BackgroundGeolocation from 'react-native-background-geolocation'
import Config from 'react-native-config'
import axios from 'axios'
import qs from 'qs'

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

  getCurrentPosition() {
    BackgroundGeolocation.getCurrentPosition().then(position => {

      const { latitude, longitude } = position.coords

      const query = {
        key: Config.GOOGLE_MAPS_BROWSER_KEY,
        latlng: [ latitude, longitude ].join(','),
      }

      // https://developers.google.com/maps/documentation/geocoding/overview#ReverseGeocoding

      axios
        .get(`https://maps.googleapis.com/maps/api/geocode/json?${qs.stringify(query)}`)
        .then(response => {

          if (response.data.status === 'OK' && response.data.results.length > 0) {

            const firstResult = response.data.results[0]
            const address =
              AddressUtils.createAddressFromGoogleDetails(firstResult)

            this.props.onSelect(address)
          }
        })

    })
  }

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
          <Icon type="FontAwesome5" name={ iconName } style={{ color: '#ffffff', fontSize: iconSize }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={ () => this.getCurrentPosition() }>
          <Icon type="MaterialIcons" name="my-location" style={{ color: '#ffffff', fontSize: 24 }} />
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
