import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const defaultSettings = {
  google_api_key: '',
  stripe_publishable_key: '',
  payment_gateway: '',
  locale: 'fr',
  country: 'fr',
  latlng: '48.872178,2.331797',
  currency_code: 'eur',
  // Canonical timezone of the server, provided by GET /api/settings.
  // Left empty on purpose: consumers fall back to the device timezone rather
  // than to a hardcoded one, which would be wrong for non-European instances.
  timezone: null,
};

class Settings {
  static synchronize(baseURL) {
    return new Promise((resolve, reject) => {
      if (!baseURL) {
        return reject('baseURL is undefined');
      }

      return axios
        .get(`${baseURL}/api/settings`, { timeout: 10000 })
        .then(res => {
          AsyncStorage.setItem('@Settings', JSON.stringify(res.data));
          resolve({ ...defaultSettings, ...res.data });
        })
        .catch(() => {
          try {
            AsyncStorage.getItem('@Settings').then((data, error) => {
              if (error || !data) {
                return reject(error);
              }

              const settings = JSON.parse(data);
              resolve(settings);
            });
          } catch (e) {
            reject(e);
          }
        });
    });
  }
}

export default Settings;
