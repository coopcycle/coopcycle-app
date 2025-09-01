import { Icon, View } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  doingIconName,
  doneIconName,
  failedIconName,
  taskTypeIconName,
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
    as={FontAwesome}
    style={iconStyle(task)}
    name={taskTypeIconName(task)}
  />
);

export const TaskStatusIcon = ({ task }) => {
  const testID = `taskListItemIcon:${task.status}:${task.id}`;

  switch (task.status) {
    case 'DOING':
      return (
        <Icon
          as={FontAwesome}
          name={doingIconName}
          style={iconStyle(task)}
          testID={testID}
        />
      );
    case 'DONE':
      return (
        <Icon
          as={FontAwesome}
          name={doneIconName}
          style={iconStyle(task)}
          testID={testID}
        />
      );
    case 'FAILED':
      return (
        <Icon
          as={FontAwesome}
          name={failedIconName}
          style={iconStyle(task)}
          testID={testID}
        />
      );
    default:
      return <View />;
  }
};