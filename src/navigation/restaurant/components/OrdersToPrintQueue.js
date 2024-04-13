import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'native-base';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAutoAcceptOrdersEnabled,
  selectIsPrinterConnected,
  selectOrderById,
  selectOrderIdsToPrint,
  selectPrintingOrderId,
} from '../../../redux/Restaurant/selectors';
import { printOrderById } from '../../../redux/Restaurant/actions';
import { useNavigation } from '@react-navigation/native';

function usePrinter() {
  const connected = useSelector(selectIsPrinterConnected);

  const orderIdsToPrint = useSelector(selectOrderIdsToPrint);
  const printingOrderId = useSelector(selectPrintingOrderId);

  const dispatch = useDispatch();

  useEffect(() => {
    if (printingOrderId) {
      return;
    }

    if (orderIdsToPrint.length === 0) {
      return;
    }

    if (!connected) {
      console.warn('Printer is not connected');
      return;
    }

    const orderId = orderIdsToPrint[0];
    dispatch(printOrderById(orderId));
  }, [printingOrderId, orderIdsToPrint, connected, dispatch]);

  return {
    printingOrderId,
    printerConnected: connected,
  };
}

export default function OrdersToPrintQueue() {
  const autoAcceptOrdersEnabled = useSelector(selectAutoAcceptOrdersEnabled);

  const { printerConnected, printingOrderId } = usePrinter();

  const printingOrder = useSelector(state =>
    selectOrderById(state, printingOrderId),
  );

  const { t } = useTranslation();

  const navigation = useNavigation();

  if (autoAcceptOrdersEnabled && !printerConnected) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.disconnected]}
        onPress={() => {
          navigation.navigate('RestaurantSettings', {
            screen: 'RestaurantPrinter',
          });
        }}>
        <Text style={styles.text}>{t('RESTAURANT_ORDER_CONNECT_PRINTER')}</Text>
      </TouchableOpacity>
    );
  } else if (printingOrder) {
    return (
      <View style={[styles.container, styles.printing]}>
        <Text style={styles.text}>
          {t('RESTAURANT_ORDER_PRINTING', {
            number: printingOrder.number,
            id: printingOrder.id,
          })}
        </Text>
        <ActivityIndicator size="small" color="white" animating={true} />
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  disconnected: {
    backgroundColor: '#f7b731',
    borderBottomColor: '#eca309',
  },
  printing: {
    backgroundColor: '#26de81',
    borderBottomColor: '#1cb568',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
});
