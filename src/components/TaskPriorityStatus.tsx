import moment from 'moment';
import Task from '../types/task';
import { whiteColor } from '../styles/common';
import { View } from 'react-native';
import { minutes } from '../utils/dates';

export const TaskPriorityStatus = ({ task }: { task: Task }) => {
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
      // No corner radius of its own: the row's wrapper clips to the card
      // shape, so rounding here only ever rounded against the card edge it
      // was already inside.
      style={{
        width: 6,
        height: '100%',
        backgroundColor: backgroundColor,
      }}
    />
  );
};
