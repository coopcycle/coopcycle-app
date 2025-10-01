import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { Calendar } from '../../components/Calendar';
import { changeDate } from '../../redux/Dispatch/actions';
import { loadTasks, selectTaskSelectedDate } from '../../redux/Courier';

export default function DateScreen({ navigation }) {
  const selectedDate = useSelector(selectTaskSelectedDate);
  const dispatch = useDispatch();

  const onDateChange = (date: moment.Moment) => {
    dispatch(changeDate(date.toISOString()));
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
