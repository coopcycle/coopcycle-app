import { Icon } from '@/components/ui/icon';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  DoingIcon,
  DoneIcon,
  FailedIcon,
  taskTypeIcon,
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

export const TaskTypeIcon = ({ task }) => (
  <Icon
    as={taskTypeIcon(task)}
    style={iconStyle(task)}
  />
);

export const TaskStatusIcon = ({ task }) => {
  const testID = `taskListItemIcon:${task.status}:${task.id}`;

  // We wrap the element in a <View>,
  // to avoid Detox sayins "matches 2 views in the hierarchy"
  // because the "testID" prop is propagated to the child elements

  switch (task.status) {
    case 'DOING':
      return (
        <View testID={testID}>
          <Icon
            as={DoingIcon}
            style={iconStyle(task)}
          />
        </View>
      );
    case 'DONE':
      return (
        <View testID={testID}>
          <Icon
            as={DoneIcon}
            style={iconStyle(task)}
          />
        </View>
      );
    case 'FAILED':
      return (
        <View testID={testID}>
          <Icon
            as={FailedIcon}
            style={iconStyle(task)}
          />
        </View>
      );
    default:
      return <View />;
  }
};
