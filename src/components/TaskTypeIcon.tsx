import { StyleSheet, TextStyle } from 'react-native';
import { taskTypeIconName } from '../navigation/task/styles/common';
import { redColor } from '../styles/common';
import type { Task } from '../types/task';
import { Icon } from './gluestack';

interface TaskTypeIconProps {
  task: Pick<Task, 'status' | 'type'>;
}

const iconStyle = (task: Pick<Task, 'status'>): TextStyle[] => {
  const style = [styles.icon];
  if (task.status === 'FAILED') {
    style.push(styles.iconDanger);
  }

  return style;
};

const TaskTypeIcon = ({ task }: TaskTypeIconProps) => (
  <Icon style={iconStyle(task)} name={taskTypeIconName(task)} />
);

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
  },
  iconDanger: {
    fontSize: 18,
    color: redColor,
  },
});

export default TaskTypeIcon;
