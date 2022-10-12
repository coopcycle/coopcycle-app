import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Config from 'react-native-config'
import { localeDetector } from '../i18n'
import qs from 'qs'
import AddressUtils from './Address'

class Geocoding {

  #country: string
  #location: string
  #provider: GeocodingProvider

  constructor(country:string = null, location:string = null) {
    if (country == null) {
      throw new Error('Country must be defined')
    }

    this.#country = country
    this.#location = location

    switch (country) {
      case 'gb':
        this.#provider = null
      default:
        this.#provider = new GoogleProvider({ country, location })
    }
    this.#provider.init()
  }

}

interface GeocodingProvider {
  init(options: Object): this;
  autocomplete(query: string): Array;
  reverse(query: Object): Object;
}

class GoogleProvider implements GeocodingProvider {

  #country: string;
  #location: string;
  #sessionToken: string;

  constructor({ country, location }) {
    this.#country = country
    this.#location = location
  }

  init(options) {
    this.#sessionToken = uuidv4()
  }

  autocomplete(query) {
    if (this.#sessionToken == null) {
      this.#sessionToken = uuidv4()
    }
    let params = {
      key: Config.GOOGLE_MAPS_BROWSER_KEY,
      language: localeDetector(),
      types: 'geocode',
      components: `country:${this.#country.toUpperCase()}`,
      sessiontoken: this.#sessionToken,
    }

    if (this.#location != null && this.#location > 0) {
      params = {
        ...params,
        location: this.#location,
        radius: 50_000,
      }
    }

    let results
    axios
      .get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&${qs.stringify(params)}`)
      .then(response => results = response.data.predictions)

    console.log(results)
    //return [];
  }

  reverse(query) {
    const params = {
      key: Config.GOOGLE_MAPS_BROWSER_KEY,
      language: localeDetector(),
      placeid: query.place_id,
      sessiontoken: this.#sessionToken,
    }
    this.#sessionToken = null
    let address
    axios
      .get(`https://maps.googleapis.com/maps/api/place/details/json?${qs.stringify(query)}`)
      .then(response => address = AddressUtils.createAddressFromGoogleDetails(response.data.result))

    return address
  }
}

export default Geocoding
