import { StyleSheet, TextStyle } from 'react-native';
import { taskTypeIconName } from '../navigation/task/styles/common';
import { greenColor, redColor } from '../styles/common';
import type { Task } from '../types/task';
import Icon from './Icon';

interface TaskTypeIconProps {
  task: Pick<Task, 'status' | 'type'>;
  colored?: boolean;
}

const iconStyle = (
  task: Pick<Task, 'status' | 'type'>,
  colored?: boolean,
): TextStyle[] => {
  const style = [styles.icon];

  if (task.status === 'FAILED') {
    style.push(styles.iconDanger);
  } else if (colored) {
    if (task.type === 'PICKUP') {
      style.push(styles.iconPickup);
    } else if (task.type === 'DROPOFF') {
      style.push(styles.iconDropoff);
    }
  }

  return style;
};

const TaskTypeIcon = ({ task, colored = false }: TaskTypeIconProps) => (
  <Icon style={iconStyle(task, colored)} name={taskTypeIconName(task)} />
);

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
  iconDanger: {
    fontSize: 18,
    color: redColor,
  },
  iconPickup: {
    fontSize: 18,
    color: redColor,
  },
  iconDropoff: {
    fontSize: 18,
    color: greenColor,
  },
});

export default TaskTypeIcon;
