import _ from 'lodash'

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
}

export default AddressUtils
