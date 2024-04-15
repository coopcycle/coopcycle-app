import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { changeDate } from '../../redux/Dispatch/actions';
import { loadTasks, selectTaskSelectedDate } from '../../redux/Courier';
import { Calendar } from '../../components/Calendar';

export default function DateScreen({ navigation }) {
  const selectedDate = useSelector(selectTaskSelectedDate);
  const dispatch = useDispatch();

  const onDateChange = date => {
    dispatch(changeDate(date));
    dispatch(loadTasks(date));

    navigation.goBack();
  };

  return (
    <Calendar
      initialDate={selectedDate.format('YYYY-MM-DD')}
      markedDates={{
        [selectedDate.format('YYYY-MM-DD')]: { selected: true },
      }}
      onDateSelect={onDateChange}
    />
  );
}
