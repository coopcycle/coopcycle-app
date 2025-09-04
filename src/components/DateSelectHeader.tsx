import moment from 'moment';
import { Icon, ArrowLeftIcon, ArrowRightIcon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import {
  dateSelectHeaderHeight,
  headerFontSize,
  primaryColor,
  whiteColor,
} from '../styles/common';

import { useTranslation } from 'react-i18next';
import { loadTasks, selectTaskSelectedDate } from '../redux/Courier';
import { changeDate } from '../redux/Courier/taskActions';

let styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dateHeader: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateHeaderText: {
    color: whiteColor,
    paddingHorizontal: 15,
    fontSize: headerFontSize,
  },
  icon: {
    color: whiteColor,
    fontSize: 32,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayContainer: {
    backgroundColor: whiteColor,
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
  },
  todayButton: {
    color: primaryColor,
    fontSize: 18,
    fontWeight: '300',
  },
});

function Button({ as, onPress }) {
  return (
    <TouchableOpacity block transparent onPress={onPress}>
      <Icon as={as} style={styles.icon} />
    </TouchableOpacity>
  );
}

export default function DateSelectHeader({ navigate }) {
  const selectedDate = useSelector(selectTaskSelectedDate);

  const isTodaySelected = selectedDate.isSame(moment(), 'day');

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const openCalendar = () => {
    navigate('CourierDate');
  };

  const onChangeDate = (date: moment.Moment) => {
    dispatch(changeDate(date.toISOString()));
    dispatch(loadTasks(date));
  };

  const onFuturePress = () => {
    onChangeDate(selectedDate.clone().add(1, 'days'));
  };

  const onPastPress = () => {
    onChangeDate(selectedDate.clone().subtract(1, 'days'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateHeader}>
        <View style={[styles.button, { width: '25%' }]}>
          <Button as={ArrowLeftIcon} onPress={onPastPress} />
        </View>
        <TouchableOpacity
          style={[styles.body, { width: '50%' }]}
          onPress={openCalendar}>
          <Text numberOfLines={1} style={styles.dateHeaderText}>
            {selectedDate.format('dddd Do MMM')}
          </Text>
        </TouchableOpacity>
        <View style={[styles.button, { width: '25%' }]}>
          <Button as={ArrowRightIcon} onPress={onFuturePress} />
        </View>
      </View>
      {isTodaySelected ? null : (
        <Pressable style={styles.todayContainer} onPress={() => {
          onChangeDate(moment());
        }}>
          <Text
            style={styles.todayButton}>
            {t('GO_TO_TODAY')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
