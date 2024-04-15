import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Icon, Text } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 15,
    color: '#ecedec',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ({ onPress }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Icon
        as={FontAwesome5}
        name="check-circle"
        solid
        style={styles.icon}
        size="lg"
      />
      <Text style={styles.text}>{t('NO_TASKS')}</Text>
      <Text note>{t('TOUCH_TO_RELOAD')}</Text>
    </TouchableOpacity>
  );
};
