import { Calendar as RNCalendar } from 'react-native-calendars'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { primaryColor, whiteColor } from '../styles/common'
import moment from 'moment/moment'
import { useTranslation } from 'react-i18next'

const styles = StyleSheet.create({
  todayContainer: {
    backgroundColor: whiteColor,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 15,
  },
  todayButton: {
    color: primaryColor,
    fontSize: 18,
    fontWeight: '300',
  },
})

export function Calendar(props) {
  const { t } = useTranslation()

  const calendarProps = {
    ...props,
    onDayPress: ({ dateString }) => {
      props.onDateSelect(moment(dateString))
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
  }

  return (
    <View>
      <RNCalendar
        {...calendarProps}
      />
      <View style={styles.todayContainer}>
        <Text style={styles.todayButton} onPress={() => {
          props.onDateSelect(moment())
        }}>{t('TODAY')}</Text>
      </View>
    </View>
  )
}
