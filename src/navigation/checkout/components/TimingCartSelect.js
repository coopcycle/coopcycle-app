import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { groupBy, map, reduce } from 'lodash';
import moment from 'moment/moment';
import { HStack, Skeleton, View } from 'native-base';
import { Platform } from 'react-native';
import { Picker } from '../../../components/Picker';
import { useGetOrderTimingQuery } from '../../../redux/api/slice';

export default function TimingCartSelect({ orderNodeId, onValueChange }) {
  const { data, isSuccess } = useGetOrderTimingQuery(orderNodeId);

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedRange, setSelectedRange] = useState(0);

  useEffect(() => {
    setSelectedRange(0);
    setSelectedDay(0);
  }, []);

  const rangesByDay = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    return reduce(
      groupBy(data.ranges, d => moment(d[0]).startOf('day').format()),
      (acc, ranges, key) => {
        acc.push({
          day: moment(key),
          values: map(ranges, range => ({
            value: range,
            label: `${moment(range[0]).format('LT')} - ${moment(
              range[1],
            ).format('LT')}`,
          })),
        });
        return acc;
      },
      [],
    );
  }, [data, isSuccess]);

  const getRangesForDay = useCallback(
    dayIndex => {
      if (!isSuccess) {
        return null;
      }

      if (rangesByDay.length <= dayIndex) {
        return null;
      }

      return rangesByDay[dayIndex].values;
    },
    [isSuccess, rangesByDay],
  );

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    onValueChange(getRangesForDay(selectedDay)[selectedRange].value);
  }, [selectedDay, selectedRange, getRangesForDay, isSuccess, onValueChange]);

  const dayItems = useMemo(() => {
    return (
      isSuccess &&
      rangesByDay.map((rangesOnDay, index) => (
        <Picker.Item
          value={index}
          label={rangesOnDay.day.format('ddd DD MMMM')}
          key={index}
        />
      ))
    );
  }, [isSuccess, rangesByDay]);

  const slotItems = useMemo(() => {
    if (!isSuccess) {
      return null;
    }

    return getRangesForDay(selectedDay).map((range, index) => (
      <Picker.Item value={index} label={range.label} key={index} />
    ));
  }, [isSuccess, selectedDay, getRangesForDay]);

  return (
    <HStack
      justifyContent={'space-around'}
      alignItems={'center'}
      space={isSuccess ? 0 : 4}>
      <Skeleton flex={1} isLoaded={isSuccess} rounded={2}>
        <View flex={1}>
          <Picker
            testID="dayPicker"
            style={Platform.select({ ios: {}, android: { height: 50 } })}
            selectedValue={selectedDay}
            onValueChange={v => {
              setSelectedRange(0);
              setSelectedDay(v);
            }}>
            {dayItems}
          </Picker>
        </View>
      </Skeleton>
      <Skeleton flex={1} isLoaded={isSuccess} rounded={2}>
        <View flex={1}>
          <Picker
            style={Platform.select({ ios: {}, android: { height: 50 } })}
            selectedValue={selectedRange}
            onValueChange={setSelectedRange}>
            {slotItems}
          </Picker>
        </View>
      </Skeleton>
    </HStack>
  );
}
