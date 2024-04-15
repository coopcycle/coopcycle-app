import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import { withTranslation } from 'react-i18next';

const WebSocketIndicator = ({ connected, t }) => (
  <View
    style={[
      styles.container,
      connected ? styles.connected : styles.disconnected,
    ]}>
    <Text style={styles.text}>
      {connected ? t('WAITING_FOR_ORDER') : t('CONN_LOST')}
    </Text>
    <ActivityIndicator size="small" color="white" animating={connected} />
  </View>
);

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

export default withTranslation()(WebSocketIndicator);
