import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

import { areSameDates } from '../../utils/dates';
import { Calendar } from '../../components/Calendar';
import { changeDate } from '../../redux/Dispatch/actions';
import { selectSelectedDate } from '../../coopcycle-frontend-js/logistics/redux';
import { clearSelectedTasks } from '../../redux/Dispatch/updateSelectedTasksSlice';


export default function DateScreen({ navigation }) {
  const selectedDate = useSelector(selectSelectedDate);
  const dispatch = useDispatch();

  const onDateChange = date => {
    if(!areSameDates(new Date(date), new Date(selectedDate))) {
      dispatch(changeDate(date));
      dispatch(clearSelectedTasks())
    }

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
