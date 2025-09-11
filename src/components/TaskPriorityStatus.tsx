import moment from 'moment';
import Task from '../types/task';
import { whiteColor } from '../styles/common';
import { View } from 'react-native';
import { minutes } from '../utils/dates';

export const TaskPriorityStatus = ({
  task,
  cardBorderRadius,
}: {
  task: Task;
  cardBorderRadius: number;
}) => {
  const timeDifference = moment().diff(task.doneBefore);
  let backgroundColor = whiteColor;

  if (timeDifference < minutes(10)) {
    backgroundColor = '#FFC300';
  } else if (timeDifference < minutes(0)) {
    backgroundColor = '#B42205';
  } else {
    return null;
  }

  return (
    <View
      style={{
        width: 6,
        height: '100%',
        backgroundColor: backgroundColor,
        borderTopRightRadius: cardBorderRadius,
        borderBottomRightRadius: cardBorderRadius,
      }}
    />
  );
};
