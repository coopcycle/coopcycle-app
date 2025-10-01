import { Icon, CloseIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { blueColor } from '../styles/common';

const DangerAlert = props => {
  const rowStyle = [styles.row];
  if (!props.onClose) {
    rowStyle.push({
      justifyContent: 'center',
    });
  }

  return (
    <View style={styles.container}>
      <View style={rowStyle}>
        <Text
          style={styles.text}
          adjustsFontSizeToFit={props.adjustsFontSizeToFit}>
          {props.text}
        </Text>
        {props.onClose && (
          <TouchableOpacity onPress={() => props.onClose()}>
            <Icon as={CloseIcon} style={{ color: blueColor }} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#d9edf7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#bce8f1',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#31708f',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
  },
});

export default withTranslation()(DangerAlert);
