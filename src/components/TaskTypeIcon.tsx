import { taskTypeIconName } from '../navigation/task/styles/common';
import { blackColor, greenColor, redColor, whiteColor } from '../styles/common';
import type { Task } from '../types/task';
import FAIcon from './Icon';

interface TaskTypeIconProps {
  task: Pick<Task, 'status' | 'type'>;
  size?: 'sm' | 'lg';
  color?: 'dark' | 'light' | 'green' | 'red';
}

// Size mappings
const SIZE_MAP = {
  sm: 14,
  lg: 42,
} as const;

// Color mappings
const COLOR_MAP = {
  dark: blackColor, // gray-700
  light: whiteColor,
  green: greenColor,
  red: redColor,
} as const;

const TaskTypeIcon = ({
  task,
  size = 'sm',
  color = 'dark',
}: TaskTypeIconProps) => {
  const iconSize = SIZE_MAP[size];
  const iconColor = COLOR_MAP[color];

  return (
    <FAIcon style={{ alignSelf: 'center' }} name={taskTypeIconName(task)} size={iconSize} color={iconColor} />
  );
};

export default TaskTypeIcon;
