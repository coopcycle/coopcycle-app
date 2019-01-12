import _ from 'lodash'

class AddressUtils {

  static createAddressFromGoogleDetails(details) {

    let streetNumber = _.find(details.address_components, component => _.includes(component.types, 'street_number'))
    let route        = _.find(details.address_components, component => _.includes(component.types, 'route'))
    let postalCode   = _.find(details.address_components, component => _.includes(component.types, 'postal_code'))
    let locality     = _.find(details.address_components, component => _.includes(component.types, 'locality'))

    streetNumber = streetNumber ? streetNumber.short_name : ''
    route        = route ? route.short_name : ''
    postalCode   = postalCode ? postalCode.short_name : ''
    locality     = locality ? locality.short_name : ''

    return {
      streetAddress: details.formatted_address,
      postalCode,
      addressLocality: locality,
      geo: {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng
      },
    }
  }
}

export default AddressUtils
