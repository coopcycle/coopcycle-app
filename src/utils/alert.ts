import { Alert } from 'react-native';

import i18n from '../i18n';

export function showAlert(error, title = i18n.t('FAILED')) {
  let message = i18n.t('TRY_LATER');

  if (typeof error === 'string') {
    message = error;
  } else if (
    error != null &&
    typeof error === 'object' &&
    // eslint-disable-next-line no-prototype-builtins
    error.hasOwnProperty('hydra:description')
  ) {
    // A rejection does not always carry a value, and this is usually called
    // from a timer — reading a property off `undefined` here threw where
    // nothing could catch it, leaving the courier with no sign that the
    // request had failed at all.
    message = error['hydra:description'];
  }

  return Alert.alert(title, message, [{ text: 'OK', onPress: () => {} }], {
    cancelable: false,
  });
}
