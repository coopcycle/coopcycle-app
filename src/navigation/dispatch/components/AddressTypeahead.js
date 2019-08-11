import React, { Component } from 'react'
import { Dimensions, View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text, Icon } from 'native-base'
import { withTranslation } from 'react-i18next'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import _ from 'lodash'

import Settings from '../../../Settings'
import { localeDetector } from '../../../i18n'

const addressInputHeight = 54
const disabledBgColor = '#C9C9CE'

const autocompleteStyles = {
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  textInputContainer: {
    backgroundColor: disabledBgColor,
    height: addressInputHeight,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    height: 38,
    borderRadius: 5,
    paddingTop: 4.5,
    paddingBottom: 4.5,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7.5,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 15,
  },
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    flexDirection: 'row',
  },
  left: {
    flex: 10,
    // paddingRight is dynamic
  },
  right: {
    flex: 2,
    backgroundColor: disabledBgColor,
    position: 'absolute',
    right: 0,
    // width is dynamic
    height: addressInputHeight,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

class AddressTypeahead extends Component {

  renderButton() {

    const { address } = this.props
    const isEmpty = _.isEmpty(address)

    if (isEmpty) {

      return (
        <Icon type="FontAwesome" name="pencil" style={{ color: '#eee' }} />
      )
    }

    return (
      <TouchableOpacity onPress={ this.props.onEditPress.bind(this) }>
        <Icon type="FontAwesome" name="pencil" />
      </TouchableOpacity>
    )
  }

  render() {

    const { width } = Dimensions.get('window')

    const buttonWidth = width * 0.15

    return (
      <View style={ styles.container }>
        <View style={ [ styles.left, { paddingRight: buttonWidth } ] }>
          <GooglePlacesAutocomplete
            placeholder={ this.props.t('ENTER_ADDRESS') }
            minLength={ 2 } // minimum length of text to search
            autoFocus={ false }
            // listViewDisplayed = auto does not hide the results when pressed
            listViewDisplayed={ false }
            fetchDetails={ true }
            onPress={ this.props.onSuggestionPress.bind(this) }
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: Settings.get('google_api_key'),
              language: localeDetector(), // language of the results
              types: 'geocode', // default: 'geocode'
            }}
            styles={ autocompleteStyles }
            // suppressDefaultStyles={ false }
            nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
              region: Settings.get('country')
            }}
            // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            filterReverseGeocodingByTypes={[ 'street_address', 'route', 'geocode' ]} />
        </View>
        <View style={ [ styles.right, { width: buttonWidth } ] }>
          { this.renderButton() }
        </View>
      </View>
    )
  }
}

export default withTranslation()(AddressTypeahead)
