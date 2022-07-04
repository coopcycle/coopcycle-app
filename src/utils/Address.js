import _ from 'lodash'
import BackgroundGeolocation from 'react-native-background-geolocation'
import Config from 'react-native-config'
import axios from 'axios'
import qs from 'qs'

class AddressUtils {

  static createAddressFromGoogleDetails(details) {

    let postalCode   = _.find(details.address_components, component => _.includes(component.types, 'postal_code'))
    let locality     = _.find(details.address_components, component => _.includes(component.types, 'locality'))

    postalCode   = postalCode ? postalCode.short_name : ''
    locality     = locality ? locality.short_name : ''

    return {
      streetAddress: details.formatted_address,
      postalCode,
      addressLocality: locality,
      geo: {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      },
      isPrecise: _.includes(details.types, 'street_address') || _.includes(details.types, 'premise'),
    }
  }

  static createAddressFromPostcode(postcode, streetAddress) {

    return {
      streetAddress: streetAddress,
      postalCode: postcode.postcode,
      addressCountry: postcode.country,
      addressLocality: postcode.admin_district || '',
      addressRegion: postcode.region || '',
      geo: {
        latitude: postcode.latitude,
        longitude: postcode.longitude,
      },
      isPrecise: true,
    }
  }

  static getAddressFromCurrentPosition() {

    return new Promise((resolve, reject) => {

      BackgroundGeolocation.setConfig({
        locationAuthorizationRequest: 'WhenInUse',
      })

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
                this.createAddressFromGoogleDetails(firstResult)

              // When using the current position,
              // we see the address as always precise
              resolve({ ...address, isPrecise: true })
            }
          })
      })
    })
  }

  static geoDiff({geo: {latitude, longitude}}, {geo: {latitude: latitude2, longitude: longitude2}}): boolean {
    return latitude === latitude2 && longitude === longitude2
  }

}

export default AddressUtils
