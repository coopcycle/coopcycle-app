import { StyleSheet, View } from 'react-native';
import { Button, Heading, Text } from 'native-base';
import Modal from 'react-native-modal';
import React, { useState } from 'react';
import {
  selectCart,
  selectIsTimeRangeChangedModalVisible,
} from '../../../redux/Checkout/selectors';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeTimeRangeChangedModal,
  setDate,
  setPersistedTimeRange,
} from '../../../redux/Checkout/actions';
import { useTranslation } from 'react-i18next';
import TimingCartSelect from './TimingCartSelect';
import DangerAlert from '../../../components/DangerAlert';
import { useBackgroundColor } from '../../../styles/theme';
import { useGetOrderTimingQuery } from '../../../redux/api/slice';
import { useNavigation } from '@react-navigation/native';
import { useIsModalVisible } from '../../../hooks/useIsModalVisible';
import tracker from '../../../analytics/Tracker';

const styles = StyleSheet.create({
  modalContent: {
    padding: 16,
  },
});

function useChooseRestaurant() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  return () => {
    dispatch(closeTimeRangeChangedModal());
    navigation.navigate('Home');
  };
}

function ChooseTimeRangeContent({ orderNodeId, restaurantNodeId }) {
  const [value, setValue] = useState(null);

  const { t } = useTranslation();

  const dispatch = useDispatch();
  const chooseRestaurant = useChooseRestaurant();

  const onSchedule = async () => {
    await dispatch(setDate(value));
    dispatch(
      setPersistedTimeRange({
        cartNodeId: orderNodeId,
        restaurantNodeId: restaurantNodeId,
        lastShownTimeRange: null,
      }),
    );
    dispatch(closeTimeRangeChangedModal());
  };

  return (
    <>
      <Text mt="8">
        {t('CART_TIME_RANGE_CHANGED_MODAL_CHOOSE_TIME_RANGE_TEXT')}
      </Text>
      <TimingCartSelect orderNodeId={orderNodeId} onValueChange={setValue} />
      <Button testID="setShippingTimeRange" mt="8" onPress={onSchedule}>
        <Text>
          {t('CART_TIME_RANGE_CHANGED_MODAL_SELECT_TIME_RANGE_ACTION')}
        </Text>
      </Button>
      <Button mt="2" variant="link" onPress={chooseRestaurant}>
        <Text>
          {t('CART_TIME_RANGE_CHANGED_MODAL_CHOOSE_RESTAURANT_ACTION')}
        </Text>
      </Button>
    </>
  );
}

function ChooseRestaurantContent() {
  const { t } = useTranslation();
  const chooseRestaurant = useChooseRestaurant();

  return (
    <Button onPress={chooseRestaurant}>
      <Text>{t('CART_TIME_RANGE_CHANGED_MODAL_CHOOSE_RESTAURANT_ACTION')}</Text>
    </Button>
  );
}

function Content({ isModalOpen }) {
  const { cart } = useSelector(selectCart);
  const orderNodeId = cart['@id'];

  const { data: timing, isFetching: isFetchingTiming } = useGetOrderTimingQuery(
    orderNodeId,
    {
      skip: !isModalOpen,
    },
  );

  if (!isModalOpen) {
    return null;
  }

  if (isFetchingTiming) {
    return <TimingCartSelect orderNodeId={orderNodeId} />;
  }

  const hasTimingOptions = timing && timing.ranges.length > 0;
  if (!hasTimingOptions) {
    return <ChooseRestaurantContent />;
  }

  return (
    <ChooseTimeRangeContent
      orderNodeId={orderNodeId}
      restaurantNodeId={cart.restaurant}
      timing={timing}
    />
  );
}

export default function TimeRangeChangedModal() {
  const isModalVisible = useIsModalVisible(
    selectIsTimeRangeChangedModalVisible,
  );
  const backgroundColor = useBackgroundColor();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const onModalHide = () => {
    dispatch(closeTimeRangeChangedModal());
  };

  return (
    <Modal
      isVisible={isModalVisible}
      onModalHide={onModalHide}
      onModalShow={() => {
        tracker.logEvent('Checkout', 'openTimeRangeChangedModal');
      }}>
      <View
        testID="timeRangeChangedModal"
        style={[styles.modalContent, { backgroundColor }]}>
        <Heading size="sm" mb="4">
          {t('CART_TIME_RANGE_CHANGED_MODAL_TITLE')}
        </Heading>
        <DangerAlert text={t('CART_TIME_RANGE_CHANGED_MODAL_MESSAGE')} />
        <Content isModalOpen={isModalVisible} />
      </View>
    </Modal>
  );
}
