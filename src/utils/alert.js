import { Alert } from 'react-native';

import i18n from '../i18n';


export function showAlert(error, title=i18n.t('FAILED')) {
    let message = i18n.t('TRY_LATER');

    // eslint-disable-next-line no-prototype-builtins
    if (error.hasOwnProperty('hydra:description')) {
      message = error['hydra:description'];
    } else if (typeof error === 'string') {
      message = error;
    }

    return Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => {}}],
      {cancelable: false}
    );
  }
