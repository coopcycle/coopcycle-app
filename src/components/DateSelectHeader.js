import React from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { Icon, Container } from 'native-base'
import Dates from 'react-native-dates'

import moment from 'moment/min/moment-with-locales'
import { primaryColor, whiteColor, dateSelectHeaderHeight, headerFontSize } from "../styles/common"

moment.locale('fr')

let styles = StyleSheet.create({
  wrapper: {
    zIndex: 10
  },
  dateHeader: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    zIndex: 2
  },
  dateHeaderText: {
    color: whiteColor,
    paddingHorizontal: 20,
    fontSize: headerFontSize
  },
  icon: {
    color: whiteColor,
    fontSize: 32
  },
  calendarIcon: {
    color: whiteColor,
    fontSize: 26,
    position: 'absolute',
    right: 25,
    padding: 5
  }
})


class DateSelectHeader extends React.Component {

  constructor(props) {
    super(props)

    this.initialCalendarTop = -400

    this.state = {
      slideCalendarAnim: new Animated.Value(this.initialCalendarTop),
      calendarToggled: false
    }
    this.onCalendarPress = this.onCalendarPress.bind(this)
  }

  onCalendarPress () {
    let { calendarToogled } = this.state

    if (calendarToogled) {
      Animated.timing(
        this.state.slideCalendarAnim,
        {
          toValue: 0,
          duration: 450,
        }
      ).start()
    } else {
      this.closeCalendar()
    }

    this.setState({calendarToogled: !calendarToogled})
  }

  closeCalendar () {
    Animated.timing(
      this.state.slideCalendarAnim,
      {
        toValue: this.initialCalendarTop,
        duration: 300,
      }
    ).start()
  }

  onDateSelect(date) {
    let { toDate } = this.props
    this.closeCalendar()
    toDate(date)
  }

  render () {
    let { toPastDate, toFutureDate, selectedDate } = this.props

    return (
      <Container style={styles.wrapper}>
        <View style={styles.dateHeader}>
          <Icon style={styles.icon} name="arrow-dropleft" onPress={toPastDate}></Icon>
          <Text style={styles.dateHeaderText}>{selectedDate.format('dddd Do MMM')}</Text>
          <Icon style={styles.icon} name="arrow-dropright" onPress={toFutureDate}></Icon>
          <Icon style={styles.calendarIcon} name="calendar" onPress={this.onCalendarPress}></Icon>
        </View>
        <Animated.View style={{top: this.state.slideCalendarAnim, right: 0, left: 0}}>
          <Dates
              range={false}
              date={selectedDate}
              onDatesChange={({date}) => {this.onDateSelect(date)}}
              isDateBlocked={() => {false}}
            />
        </Animated.View>
      </Container>
    )
  }
}

export default DateSelectHeader