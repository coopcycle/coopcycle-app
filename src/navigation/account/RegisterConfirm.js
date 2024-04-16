import { Button, Center, Text } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { CommonActions, useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import NavigationHolder from '../../NavigationHolder';
import { confirmRegistration } from '../../redux/App/actions';
import { selectIsLoading } from '../../redux/App/selectors';

const RegisterConfirm = ({ route }) => {
  const { token } = route.params;

  const isLoading = useSelector(selectIsLoading);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && token) {
      dispatch(confirmRegistration(token));
    }
  }, [token, isFocused, dispatch]);

  const _onPressLogin = useCallback(() => {
    NavigationHolder.dispatch(
      CommonActions.navigate({
        name: 'AccountNav',
        params: {
          screen: 'AccountHome',
        },
      }),
    );
  }, []);

  return (
    <Center flex={1}>
      {isLoading ? (
        <View />
      ) : (
        <View>
          <Text note>{t('REGISTER_CHECK_EMAIL_ALREADY_ACTIVATED')}</Text>
          <Button block transparent onPress={_onPressLogin}>
            <Text>{t('REGISTER_CHECK_EMAIL_LOGIN')}</Text>
          </Button>
        </View>
      )}
    </Center>
  );
};

export default RegisterConfirm;
