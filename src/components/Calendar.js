import { Calendar as RNCalendar } from 'react-native-calendars';
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { primaryColor, whiteColor } from '../styles/common';
import moment from 'moment/moment';
import { useTranslation } from 'react-i18next';
import { View } from 'native-base';

const styles = StyleSheet.create({
  todayContainer: {
    backgroundColor: whiteColor,
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  todayButton: {
    color: primaryColor,
    fontSize: 18,
    fontWeight: '300',
  },
});

export function Calendar(props) {
  const { t } = useTranslation();

  const calendarProps = {
    ...props,
    onDayPress: ({ dateString }) => {
      props.onDateSelect(moment(dateString));
    },
    style: {
      ...props.style,
    },
    theme: {
      textSectionTitleColor: primaryColor, // days of the week
      selectedDayBackgroundColor: primaryColor, // for marked dates
      selectedDayTextColor: whiteColor, // for marked dates
      todayTextColor: primaryColor,
      arrowColor: primaryColor,
      monthTextColor: primaryColor,
      textDayFontSize: 18,
      textMonthFontSize: 18,
      textDayHeaderFontSize: 18,
      ...props.theme,
    },
  };

  return (
    <View>
      <RNCalendar {...calendarProps} />
      <View style={styles.todayContainer}>
        <Text
          style={styles.todayButton}
          onPress={() => {
            props.onDateSelect(moment());
          }}>
          {t('GO_TO_TODAY')}
        </Text>
      </View>
    </View>
  );
}
