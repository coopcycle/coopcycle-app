import React from 'react';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  taskTypeIcon,
  DoneIcon,
  FailedIcon,
} from '../navigation/task/styles/common';
import { darkGreyColor, lightGreyColor, redColor } from '../styles/common';
import { useBackgroundContainerColor } from '../styles/theme';
import { Task } from '../types/task';

const markerColor = (task: Task) => {
  let color = darkGreyColor;

  if (task.tags.length > 0) {
    color = task.tags[0].color;
  } else if (!task.isAssigned) {
    color = lightGreyColor;
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

const markerOpacity = (task: Task) => {
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

const backgroundStyle = ({
  task,
  backgroundColor,
}: {
  task: Task;
  backgroundColor: string;
}) => {
  return {
    width: containerSize,
    height: containerSize,
    backgroundColor: backgroundColor,
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

const iconStyle = (task: Task) => {
  return {
    position: 'absolute',
    color: markerColor(task),
    opacity: markerOpacity(task),
  };
};

const taskStatusIcon = (task: Task) => {
  switch (task.status) {
    case 'DONE':
      return DoneIcon;
    case 'FAILED':
      return FailedIcon;
    default:
      return taskTypeIcon(task);
  }
};

const icon = (task: Task, type: string) => {
  if (type === 'status') {
    return taskStatusIcon(task);
  } else {
    return taskTypeIcon(task);
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

interface IProps {
  task: Task;
  type?: string;
  hasWarnings?: boolean;
  testID?: string;
}
export default ({ task, type, hasWarnings, testID }: IProps) => {
  const _icon = icon(task, type);
  const backgroundColor = useBackgroundContainerColor();

  return (
    <View
      style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={backgroundStyle({ task, backgroundColor })}
        testID={testID || `taskmarker-${task.id}`}
      />
      {hasWarnings ? (
        <Text bold style={warnIconStyle()}>
          .
        </Text>
      ) : null}
      <Icon
        as={_icon}
        style={iconStyle(task)}
        size="md"
      />
    </View>
  );
};
