import { Button, Text } from 'native-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectIsCentrifugoConnected,
  selectIsCentrifugoConnecting,
} from '../../../redux/App/selectors';
import { connect } from '../../../redux/middlewares/CentrifugoMiddleware/actions';

const WebSocketIndicator = () => {
  const connecting = useSelector(selectIsCentrifugoConnecting);
  const connected = useSelector(selectIsCentrifugoConnected);

  const dispatch = useDispatch();

  const { t } = useTranslation();

  return (
    <View
      style={[
        styles.container,
        connected ? styles.connected : styles.disconnected,
      ]}>
      <Text style={styles.text}>
        {connected
          ? t('WAITING_FOR_ORDER')
          : connecting
          ? t('CONN_LOST')
          : t('CONN_LOST_IDLE')}
      </Text>
      {connected ? (
        <ActivityIndicator size="small" color="white" animating={true} />
      ) : null}
      {!connected && !connecting ? (
        <Button
          variant="link"
          onPress={() => {
            dispatch(connect());
          }}>
          <Text style={styles.text}>{t('RETRY')}</Text>
        </Button>
      ) : null}
    </View>
  );
};

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
  connected: {
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

export default WebSocketIndicator;
