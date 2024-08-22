import React, { useEffect, useMemo, useState } from 'react';
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

  const values = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    return reduce(
      groupBy(data.ranges, d => moment(d[0]).startOf('day').format()),
      (acc, day, index) => {
        acc.push({
          day: moment(index),
          values: map(day, range => ({
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

  useEffect(() => {
    if (!isSuccess) {
      return;
    }
    if (values.length < selectedDay) {
      return;
    }

    onValueChange(values[selectedDay].values[selectedRange].value);
  }, [selectedDay, selectedRange, values, isSuccess, onValueChange]);

  const dayItems = useMemo(() => {
    return (
      isSuccess &&
      values.map((day, index) => (
        <Picker.Item
          value={index}
          label={day.day.format('ddd DD MMMM')}
          key={index}
        />
      ))
    );
  }, [isSuccess, values]);

  const slotItems = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    if (values.length < selectedDay) {
      return null;
    }

    return values[selectedDay].values.map((range, index) => (
      <Picker.Item value={index} label={range.label} key={index} />
    ));
  }, [isSuccess, selectedDay, values]);

  return (
    <HStack
      justifyContent={'space-around'}
      alignItems={'center'}
      space={isSuccess ? 0 : 4}>
      <Skeleton flex={1} isLoaded={isSuccess} rounded={2}>
        <View flex={1}>
          <Picker
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
