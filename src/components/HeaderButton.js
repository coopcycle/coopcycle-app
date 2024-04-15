import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Text, useColorModeValue } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const asProp = name => {
  switch (name) {
    case 'FontAwesome':
      return FontAwesome;
    case 'FontAwesome5':
      return FontAwesome5;
  }

  return Ionicons;
};

const HeaderButton = props => {
  const color = useColorModeValue('#000', '#fff');
  const containerStyles = [styles.base];
  if (props.textLeft) {
    containerStyles.push(styles.withText);
  }

  let iconStyle = [{ color: color }];

  if (props.iconStyle) {
    iconStyle.push(props.iconStyle);
  }

  let otherProps = {};
  if (props.testID) {
    otherProps = {
      ...otherProps,
      testID: props.testID,
    };
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={containerStyles}
      {...otherProps}>
      {props.textLeft && (
        <Text style={[styles.textLeft, { color: color }]}>
          {props.textLeft}
        </Text>
      )}
      <Icon
        as={asProp(props.iconType)}
        name={props.iconName}
        style={iconStyle}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  withText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textLeft: {
    paddingRight: 15,
  },
});

export default HeaderButton;
