import { Icon, Text } from 'native-base';
import React from 'react';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  doneIconName,
  failedIconName,
  taskTypeIconName,
} from '../navigation/task/styles/common';
import { darkGreyColor, redColor, whiteColor } from '../styles/common';

const container = {
  margin: 10,
  alignItems: 'center',
  justifyContent: 'center',
};

const markerColor = task => {
  let color = darkGreyColor;

  if (task.tags.length > 0) {
    color = task.tags[0].color;
  }

  switch (task.status) {
    case 'DONE':
      return color;
    case 'FAILED':
      return redColor;
    default:
      return color;
  }
};

const markerOpacity = task => {
  switch (task.status) {
    case 'DONE':
      return 0.4;
    case 'FAILED':
      return 0.4;
    default:
      return 1;
  }
};

const containerSize = 32;
const background = whiteColor;

const backgroundStyle = task => {
  return {
    width: containerSize,
    height: containerSize,
    backgroundColor: background,
    borderColor: markerColor(task),
    opacity: markerOpacity(task),
    borderWidth: 2,
    borderStyle: 'solid',
    borderTopLeftRadius: containerSize / 2,
    borderTopRightRadius: containerSize / 2,
    borderBottomLeftRadius: containerSize / 2,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
  };
};

const iconStyle = task => {
  return {
    position: 'absolute',
    color: markerColor(task),
    opacity: markerOpacity(task),
  };
};

const taskStatusIconName = task => {
  switch (task.status) {
    case 'DONE':
      return doneIconName;
    case 'FAILED':
      return failedIconName;
    default:
      return taskTypeIconName(task);
  }
};

const iconName = (task, type = 'type') => {
  if (type === 'status') {
    return taskStatusIconName(task);
  } else {
    return taskTypeIconName(task);
  }
};

const warnIconStyle = () => {
  return {
    position: 'absolute',
    right: 0,
    top: -3,
    color: 'red',
    fontSize: 38,
  };
};

export default ({ task, type, hasWarnings }) => {
  const _iconName = iconName(task, type);

  return (
    <View style={container}>
      <View style={backgroundStyle(task)} />
      {hasWarnings ? (
        <Text bold style={warnIconStyle()}>
          .
        </Text>
      ) : null}
      <Icon
        as={FontAwesome}
        name={_iconName}
        style={iconStyle(task)}
        size="xs"
        testID={`taskMarker-${_iconName}`}
      />
    </View>
  );
};
