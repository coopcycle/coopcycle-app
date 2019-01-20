import React, { Component } from 'react'
import { Dimensions, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { translate } from 'react-i18next'

import { localeDetector } from '../i18n'
import Settings from '../Settings'
import AddressUtils from '../utils/Address'

const customStyles = {
  description: {
    fontWeight: 'bold',
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
  textInputContainer: {
    backgroundColor: '#e4022d',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    backgroundColor: '#ffffff',
  }
}

class AddressTypeahead extends Component {

  constructor(props) {
    super(props)
  }

  createAddress(details) {

    return AddressUtils.createAddressFromGoogleDetails(details)
  }

  render() {

    const { height, width } = Dimensions.get('window')

    const styles = {
      ...customStyles,
      // Make sure ListView takes 100% width
      listView: { width }
    }

    // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
    // currentLocationLabel="Current location"
    // predefinedPlaces={[homePlace, workPlace]}
    return (
      <GooglePlacesAutocomplete
        placeholder={ this.props.t('ENTER_ADDRESS') }
        minLength={ 2 } // minimum length of text to search
        autoFocus={ false }
        // listViewDisplayed = auto does not hide the results when pressed
        listViewDisplayed={ false }
        fetchDetails={ true }
        // 'details' is provided when fetchDetails = true
        onPress={(data, details = null) => {
          const address = this.createAddress(details)
          this.props.onPress(address);
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: Settings.get('google_api_key'),
          language: localeDetector(), // language of the results
          types: 'geocode', // default: 'geocode'
        }}
        styles={ styles }
        nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          region: Settings.get('country')
        }}
        // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        filterReverseGeocodingByTypes={[ 'street_address', 'route', 'geocode' ]} />
    );
  }
}

export default translate()(AddressTypeahead)
