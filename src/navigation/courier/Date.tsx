import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { Calendar } from '../../components/Calendar';
import { changeDate as changeDispatchDate } from '../../redux/Dispatch/actions';
import { selectTaskSelectedDate } from '../../redux/Courier';
import { changeDate } from '../../redux/Courier/taskActions';

export default function DateScreen({ navigation }) {
  const selectedDate = useSelector(selectTaskSelectedDate);
  const dispatch = useDispatch();

  const onDateChange = (date: moment.Moment) => {
    dispatch(changeDispatchDate(date.toISOString()));
    // Selecting the date is enough to load it — `useGetMyTasksQuery` picks up
    // the new date. `loadTasks` used to be dispatched here as well, which
    // issued a second, identical request. It also set the courier's selected
    // date as a side effect, so that now goes through `changeDate`.
    dispatch(changeDate(date.toISOString()));
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
