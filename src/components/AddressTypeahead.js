import React, { Component } from 'react'
import { Dimensions, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { withTranslation } from 'react-i18next'

import { localeDetector } from '../i18n'
import Settings from '../Settings'
import AddressUtils from '../utils/Address'

class AddressTypeahead extends Component {

  googlePlacesAutocomplete = null

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (this.props.value) {
      this.googlePlacesAutocomplete.setAddressText(this.props.value)
    }
  }

  createAddress(details) {

    return AddressUtils.createAddressFromGoogleDetails(details)
  }

  render() {

    const { height, width } = Dimensions.get('window')

    const styles = {
      ...this.props.style,
      // Make sure ListView takes 100% width
      listView: { width },
    }

    const country = Settings.get('country').toUpperCase()

    let textInputProps = {
      autoCorrect: false,
    }
    let otherProps = {}

    if (this.props.testID) {
      textInputProps = {
        ...textInputProps,
        testID: this.props.testID,
      }
    }

    if (this.props.onFocus) {
      textInputProps = {
        ...textInputProps,
        onFocus: this.props.onFocus,
      }
    }

    if (this.props.onBlur) {
      textInputProps = {
        ...textInputProps,
        onBlur: this.props.onBlur,
      }
    }
    if (this.props.onChangeText) {
      textInputProps = {
        ...textInputProps,
        onChangeText: this.props.onChangeText,
      }
    }
    if (this.props.defaultValue) {
      textInputProps = {
        ...textInputProps,
        defaultValue: this.props.defaultValue,
      }
      otherProps = {
        ...otherProps,
        getDefaultValue: () => this.props.defaultValue,
      }
    }


    if (this.props.renderDescription) {
      otherProps = {
        ...otherProps,
        renderDescription: this.props.renderDescription,
      }
    }
    if (this.props.renderRow) {
      otherProps = {
        ...otherProps,
        renderRow: this.props.renderRow,
      }
    }

    // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
    // currentLocationLabel="Current location"
    // predefinedPlaces={[homePlace, workPlace]}
    return (
      <GooglePlacesAutocomplete
        ref={ ref => this.googlePlacesAutocomplete = ref }
        placeholder={ this.props.t('ENTER_ADDRESS') }
        minLength={ 2 } // minimum length of text to search
        autoFocus={ this.props.autoFocus || false }
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
          components: `country:${country}`,
        }}
        styles={ styles }
        textInputProps={ textInputProps }
        renderLeftButton={ this.props.renderLeftButton }
        nearbyPlacesAPI="GoogleReverseGeocoding" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
          components: `country:${country}`,
        }}
        // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
        filterReverseGeocodingByTypes={[ 'street_address', 'route', 'geocode' ]}
        { ...otherProps } />
    );
  }
}

export default withTranslation()(AddressTypeahead)
