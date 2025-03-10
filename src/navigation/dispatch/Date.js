import { useDispatch, useSelector } from 'react-redux';
import React from 'react';

import { Calendar } from '../../components/Calendar';
import { changeDate } from '../../redux/Dispatch/actions';
import { selectSelectedDate } from '../../coopcycle-frontend-js/logistics/redux';


export default function DateScreen({ navigation }) {
  const selectedDate = useSelector(selectSelectedDate);
  const dispatch = useDispatch();

  const onDateChange = date => {
    dispatch(changeDate(date));
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
