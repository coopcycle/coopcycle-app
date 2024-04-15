import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTranslation } from 'react-i18next';
import { Icon, Text } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: '#cdcdcd',
    fontSize: 38,
    marginBottom: 15,
  },
});

const Offline = ({ t }) => {
  return (
    <View style={styles.container}>
      <Icon as={FontAwesome5} name="frown" regular style={styles.icon} />
      <Text>{t('OFFLINE')}</Text>
    </View>
  );
};

export default withTranslation()(Offline);
