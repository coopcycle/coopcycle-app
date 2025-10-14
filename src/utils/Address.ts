import axios from 'axios';
import _ from 'lodash';
import qs from 'qs';
import { Linking, Platform } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Config from 'react-native-config';

class AddressUtils {
  static createAddressFromGoogleDetails(details) {
    let postalCode = _.find(details.addressComponents, component =>
      _.includes(component.types, 'postal_code'),
    );
    let locality = _.find(details.addressComponents, component =>
      _.includes(component.types, 'locality'),
    );

    postalCode = postalCode ? postalCode.shortText : '';
    locality = locality ? locality.shortText : '';

    return {
      streetAddress: details.formattedAddress,
      postalCode,
      addressLocality: locality,
      geo: {
        latitude: details.location.latitude,
        longitude: details.location.longitude,
      },
      isPrecise:
        _.includes(details.types, 'street_address') ||
        _.includes(details.types, 'premise'),
    };
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
    };
  }

  /**
   * Create a formatted address object from Google Geocoding API response
   * This is used for handling map picker selections
   * @param {Object} geocodingResult - Result from Google Geocoding API
   * @returns {Object} Formatted address
   */
  static createAddressFromGoogleGeocoding(geocodingResult) {
    if (!geocodingResult || !geocodingResult.address_components) {
      return {};
    }

    // Extract common components
    let postalCode = _.find(geocodingResult.address_components, component =>
      _.includes(component.types, 'postal_code'),
    );
    let locality = _.find(geocodingResult.address_components, component =>
      _.includes(component.types, 'locality'),
    );
    let country = _.find(geocodingResult.address_components, component =>
      _.includes(component.types, 'country'),
    );
    let adminArea1 = _.find(geocodingResult.address_components, component =>
      _.includes(component.types, 'administrative_area_level_1'),
    );

    // Format the address
    return {
      streetAddress: geocodingResult.formatted_address,
      postalCode: postalCode ? postalCode.short_name : '',
      addressLocality: locality ? locality.short_name : '',
      addressCountry: country ? country.short_name : '',
      addressRegion: adminArea1 ? adminArea1.short_name : '',
      geo: {
        latitude: geocodingResult.geometry.location.lat,
        longitude: geocodingResult.geometry.location.lng,
      },
      isPrecise: true
    };
  }

  /**
   * Create a manual address from map coordinates
   * This is used when geocoding fails but we still have coordinates
   * @param {Object} coordinates - {latitude, longitude}
   * @returns {Object} Basic address with coordinates
   */
  static createManualAddressFromCoordinates(coordinates) {
    const { latitude, longitude } = coordinates;

    return {
      streetAddress: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      postalCode: '',
      addressLocality: '',
      geo: {
        latitude,
        longitude,
      },
      isPrecise: true, // Manual pin placements are considered precise
      isManuallyPinned: true,
    };
  }

  static getAddressFromCurrentPosition() {
    return new Promise((resolve, reject) => {
      BackgroundGeolocation.setConfig({
        locationAuthorizationRequest: 'WhenInUse',
      });

      BackgroundGeolocation.getCurrentPosition().then(position => {
        const { latitude, longitude } = position.coords;

        const query = {
          key: Config.GOOGLE_MAPS_BROWSER_KEY,
          latlng: [latitude, longitude].join(','),
        };

        // https://developers.google.com/maps/documentation/geocoding/overview#ReverseGeocoding

        axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?${qs.stringify(
              query,
            )}`,
          )
          .then(response => {
            if (
              response.data.status === 'OK' &&
              response.data.results.length > 0
            ) {
              const firstResult = response.data.results[0];
              const address = this.createAddressFromGoogleGeocoding(firstResult);

              // When using the current position,
              // we see the address as always precise
              resolve({ ...address, isPrecise: true });
            } else {
              // If geocoding fails, create a manual address with coordinates
              resolve(this.createManualAddressFromCoordinates({
                latitude,
                longitude,
              }));
            }
          })
          .catch(error => {
            console.error('Error getting address from position:', error);
            // Fallback to manual coordinates
            resolve(this.createManualAddressFromCoordinates({
              latitude,
              longitude,
            }));
          });
      }).catch(error => {
        console.error('Error getting current position:', error);
        reject(error);
      });
    });
  }

  static geoDiff(
    { geo: { latitude, longitude } },
    { geo: { latitude: latitude2, longitude: longitude2 } },
  ) {
    return latitude === latitude2 && longitude === longitude2;
  }

  static openMap({ latitude, longitude }, label) {
    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${label}`,
      android: `geo:${latitude},${longitude}?q=${label}`,
    });

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browser_url = `https://google.com/maps/@${latitude},${longitude}?q=${label}`;
        return Linking.openURL(browser_url);
      }
    });
  }
}

export default AddressUtils;
