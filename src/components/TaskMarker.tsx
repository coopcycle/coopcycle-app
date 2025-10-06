import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

import {
  DoneIcon,
  FailedIcon,
  taskTypeIcon,
} from '../navigation/task/styles/common';
import { redColor } from '../styles/common';
import {
  useBackgroundContainerColor,
  useBlackAndWhiteTextColor,
  useSecondaryTextColor,
} from '../styles/theme';
import { Task } from '../types/task';

const CONTAINER_SIZE = 32;

const getTaskColor = (
  task: Task,
  defaultColor: string,
  unassignedColor: string,
): string => {
  if (task.status === 'FAILED') {
    return redColor;
  }

  // Use tag color if available (first tag if multiple)
  if (task.tags.length > 0) {
    return task.tags[0].color;
  }

  // Use unassigned color for unassigned tasks
  return task.isAssigned ? defaultColor : unassignedColor;
};

const getTaskOpacity = (task: Task): number => {
  return ['DONE', 'FAILED'].includes(task.status) ? 0.4 : 1;
};

const getTaskIcon = (task: Task, type?: string) => {
  if (type === 'status') {
    switch (task.status) {
      case 'DONE':
        return DoneIcon;
      case 'FAILED':
        return FailedIcon;
      default:
        return taskTypeIcon(task);
    }
  }
  return taskTypeIcon(task);
};

// TODO check this use case
const WARNING_ICON_STYLE: TextStyle = {
  position: 'absolute',
  right: 0,
  top: -3,
  color: 'red',
  fontSize: 38,
};

interface TaskMarkerProps {
  task: Task;
  type?: string;
  hasWarnings?: boolean;
  testID?: string;
}

const TaskMarker = ({ task, type, hasWarnings, testID }: TaskMarkerProps) => {
  const backgroundColor = useBackgroundContainerColor();
  const defaultColor = useBlackAndWhiteTextColor();
  const unassignedColor = useSecondaryTextColor();

  const taskColor = getTaskColor(task, defaultColor, unassignedColor);
  const taskOpacity = getTaskOpacity(task);
  const taskIcon = getTaskIcon(task, type);

  const markerStyle: ViewStyle = {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    backgroundColor,
    borderColor: taskColor,
    opacity: taskOpacity,
    borderWidth: 2,
    borderStyle: 'solid',
    borderTopLeftRadius: CONTAINER_SIZE / 2,
    borderTopRightRadius: CONTAINER_SIZE / 2,
    borderBottomLeftRadius: CONTAINER_SIZE / 2,
    borderBottomRightRadius: 0,
    transform: [{ rotate: '45deg' }],
  };

  const iconStyleObj: TextStyle = {
    position: 'absolute',
    color: taskColor,
    opacity: taskOpacity,
  };

  return (
    <View
      style={{ margin: 10, alignItems: 'center', justifyContent: 'center' }}>
      <View style={markerStyle} testID={testID || `taskmarker-${task.id}`} />
      {hasWarnings && (
        <Text bold style={WARNING_ICON_STYLE}>
          .
        </Text>
      )}
      <Icon as={taskIcon} style={iconStyleObj} size="md" />
    </View>
  );
};

export default TaskMarker;
