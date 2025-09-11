import { Icon } from '@/components/ui/icon';
import { View } from 'react-native';

import {
  DoingIcon,
  DoneIcon,
  FailedIcon,
} from '../navigation/task/styles/common';
import { Task } from '../types/Task';
import { styles } from './TaskListItem';

const iconStyle = (task: Task) => {
  const style = [styles.icon];
  if (task.status === 'FAILED') {
    style.push(styles.iconDanger);
  }
  return style;
};

export const TaskStatusIcon = ({ task }) => {
  const testID = `taskListItemIcon:${task.status}:${task.id}`;

  // We wrap the element in a <View>,
  // to avoid Detox sayins "matches 2 views in the hierarchy"
  // because the "testID" prop is propagated to the child elements

  switch (task.status) {
    case 'DOING':
      return <Icon as={DoingIcon} style={iconStyle(task)} testID={testID} />;
    case 'DONE':
      return <Icon as={DoneIcon} style={iconStyle(task)} testID={testID} />;
    case 'FAILED':
      return <Icon as={FailedIcon} style={iconStyle(task)} testID={testID} />;
    default:
      return <View />;
  }
};

