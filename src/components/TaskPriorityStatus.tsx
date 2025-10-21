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
  if (task.status === 'DONE' || task.status === 'FAILED') {
    return null;
  }
  //Ensure future tasks return a positive value and overdue tasks return a negative one.
  const timeDifference = moment(task.doneBefore).diff(moment());
  let backgroundColor = whiteColor;

  if (timeDifference < 0) {
    backgroundColor = '#B42205';
  } else if (timeDifference < minutes(10)) {
    backgroundColor = '#FFC300';
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
