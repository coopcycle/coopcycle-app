import { Text } from '@/components/ui/text';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
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
      <FontAwesome5
        name="check-circle"
        solid
        style={styles.icon}
        size={32}
      />
      <Text style={styles.text}>{t('NO_TASKS')}</Text>
      <Text note>{t('TOUCH_TO_RELOAD')}</Text>
    </TouchableOpacity>
  );
};
