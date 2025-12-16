import React, { useCallback, useEffect, useState } from 'react';
import { Alert, NativeModules } from 'react-native';
import { Center } from '@/components/ui/center';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import moment from 'moment';

import DangerAlert from '../../components/DangerAlert';
import Offline from '../../components/Offline';

import DatePickerHeader from './components/DatePickerHeader';
import OrderList from './components/OrderList';
import WebSocketIndicator from './components/WebSocketIndicator';

import {
  selectIsCentrifugoConnected,
  selectIsLoading,
} from '../../redux/App/selectors';
import {
  changeDate,
  changeStatus,
  deleteOpeningHoursSpecification,
  loadOrderAndNavigate,
  loadOrders,
} from '../../redux/Restaurant/actions';
import {
  selectDate,
  selectRestaurant,
  selectSpecialOpeningHoursSpecificationForToday,
} from '../../redux/Restaurant/selectors';
import PushNotification from '../../notifications';
import OrdersToPrintQueue from './components/OrdersToPrintQueue';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';

const RNSound = NativeModules.RNSound;

export default function DashboardPage({ navigation, route }) {
  const restaurant = useSelector(selectRestaurant);
  const date = useSelector(selectDate);
  const specialOpeningHoursSpecification = useSelector(
    selectSpecialOpeningHoursSpecificationForToday,
  );

  const isInternetReachable = useSelector(
    state => state.app.isInternetReachable,
  );
  const isLoading = useSelector(selectIsLoading);

  const { navigate } = navigation;

  const [wasAlertShown, setWasAlertShown] = useState(false);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  useEffect(() => {
    activateKeepAwakeAsync();

    return () => {
      deactivateKeepAwake();
    };
  }, []);

  useEffect(() => {
    if (route.params?.loadOrders ?? true) {
      dispatch(
        loadOrders(restaurant, date.format('YYYY-MM-DD'), () => {
          // If getInitialNotification returns something,
          // it means the app was opened from a quit state.
          //
          // We handle this here, and *NOT* in NotificationHandler,
          // because when the app opens from a quit state,
          // NotificationHandler.componentDidMount is called too early.
          //
          // It tries to call loadOrderAndNavigate, and it fails
          // because Redux is not completely ready.
          //
          // It's not a big issue to handle this here,
          // because as the app was opened from a quit state,
          // the home screen will be this one (for restaurants).
          //
          // @see https://rnfirebase.io/messaging/notifications#handling-interaction
          PushNotification.getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
              const { event } = remoteMessage.data;
              if (event && event.name === 'order:created') {
                dispatch(loadOrderAndNavigate(event.data.order));
              }
            }
          });
        }),
      );
    }
  }, [restaurant, date, dispatch, route.params?.loadOrders]);

  const _checkSystemVolume = useCallback(() => {
    RNSound.getSystemVolume(volume => {
      if (volume < 0.4) {
        setWasAlertShown(true);
        Alert.alert(
          t('RESTAURANT_SOUND_ALERT_TITLE'),
          t('RESTAURANT_SOUND_ALERT_MESSAGE'),
          [
            {
              text: t('RESTAURANT_SOUND_ALERT_CONFIRM'),
              onPress: () => {
                // If would be cool to open the device settings directly,
                // but it is not (yet) possible to sent an Intent with extra flags
                // https://stackoverflow.com/questions/57514207/open-settings-using-linking-sendintent
                // if (Platform.OS === 'android') {
                //   // https://developer.android.com/reference/android/provider/Settings#ACTION_SOUND_SETTINGS
                //   Linking.sendIntent('android.settings.SOUND_SETTINGS')
                // }
              },
            },
            {
              text: t('CANCEL'),
              style: 'cancel',
            },
          ],
        );
      }
    });
  }, [t]);

  useEffect(() => {
    // Make sure to show Alert once loading has finished,
    // or it will be closed on iOS
    // https://github.com/facebook/react-native/issues/10471
    if (!wasAlertShown && !isLoading) {
      _checkSystemVolume();
      // setTimeout(() => _checkSystemVolume(), 1500)
    }
  }, [isLoading, wasAlertShown, _checkSystemVolume]);

  if (!isInternetReachable) {
    return (
      <Center flex={1}>
        <Offline />
      </Center>
    );
  }

  return (
    <BasicSafeAreaView>
      {restaurant.state === 'rush' && (
        <DangerAlert
          text={t('RESTAURANT_ALERT_RUSH_MODE_ON')}
          onClose={() => dispatch(changeStatus(restaurant, 'normal'))}
        />
      )}
      {specialOpeningHoursSpecification && (
        <DangerAlert
          text={t('RESTAURANT_ALERT_CLOSED')}
          onClose={() =>
            dispatch(
              deleteOpeningHoursSpecification(specialOpeningHoursSpecification),
            )
          }
        />
      )}
      <WebSocketIndicator />
      <OrdersToPrintQueue />
      <DatePickerHeader
        date={date}
        onCalendarClick={() => navigate('RestaurantDate')}
        onTodayClick={() => dispatch(changeDate(moment().toISOString()))}
      />
      <OrderList
        onItemClick={order => navigate('RestaurantOrder', { order })}
      />
    </BasicSafeAreaView>
  );
}
