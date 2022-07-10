import React from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'native-base'
import { Calendar } from 'react-native-calendars'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { calendarHeight, dateSelectHeaderHeight, headerFontSize, primaryColor, whiteColor } from '../styles/common'

let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
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
  calendarWidget: {
    position: 'relative',
    zIndex: -1,
    height: calendarHeight, // workaround for https://github.com/wix/react-native-calendars/issues/338
  },
})

class DateSelectHeader extends React.Component {

  constructor(props) {
    super(props)

    this.initialCalendarTop = -1 * (dateSelectHeaderHeight + calendarHeight)

    // FIXME
    // We still need to add some more height
    this.initialCalendarTop -= 30

    this.state = {
      height: dateSelectHeaderHeight,
      slideCalendarAnim: new Animated.Value(this.initialCalendarTop),
      showCalendar: false,
    }

    this.toggleCalendar = this.toggleCalendar.bind(this)
    this.onDateSelect = this.onDateSelect.bind(this)
    this.onFuturePress = this.onFuturePress.bind(this)
    this.onPastPress = this.onPastPress.bind(this)
  }

  componentDidUpdate(prevProps, prevState) {
    const { showCalendar } = prevState

    if (this.state.showCalendar && !showCalendar) {
      this.openCalendar()
    }
    if (!this.state.showCalendar && showCalendar) {
      this.closeCalendar()
    }
  }

  toggleCalendar() {
    const { showCalendar } = this.state

    let newHeight
    if (showCalendar) {
      newHeight = dateSelectHeaderHeight
    } else {
      newHeight = dateSelectHeaderHeight + calendarHeight
    }

    this.setState(Object.assign({}, this.state, {
      showCalendar: !showCalendar,
      height: newHeight,
    }))
  }

  openCalendar() {
    Animated.timing(
      this.state.slideCalendarAnim,
      {
        toValue: 0,
        duration: 450,
        useNativeDriver: false,
      }
    ).start()
  }

  closeCalendar() {
    Animated.timing(
      this.state.slideCalendarAnim,
      {
        toValue: this.initialCalendarTop,
        duration: 350,
        useNativeDriver: false,
      }
    ).start()
  }

  renderButton(iconName, onPress, style) {
    return (
      <TouchableOpacity block transparent onPress={ onPress }>
        <Icon as={ Ionicons } name={ iconName } style={style} />
      </TouchableOpacity>
    )
  }

  onDateSelect(selectedDate) {
    const { toDate } = this.props
    this.closeCalendar()
    this.toggleCalendar()
    toDate(selectedDate)
  }

  onFuturePress() {
    const { toDate, selectedDate } = this.props
    toDate(selectedDate.clone().add(1, 'days'))
  }

  onPastPress() {
    const { toDate, selectedDate } = this.props
    toDate(selectedDate.clone().subtract(1, 'days'))
  }

  render () {

    const { selectedDate, buttonsEnabled } = this.props

    return (
      <View style={[styles.container, { height: this.state.height }]}>
        <View style={ styles.dateHeader }>
          <View style={ [ styles.button, { width: '25%' } ] }>
            { buttonsEnabled && this.renderButton('arrow-back', this.onPastPress, styles.icon) }
          </View>
          <TouchableOpacity style={ [ styles.body, { width: '50%' } ] } onPress={ this.toggleCalendar }>
            <Text numberOfLines={ 1 } style={styles.dateHeaderText}>
              { moment(selectedDate).format('dddd Do MMM') }
            </Text>
          </TouchableOpacity>
          <View style={ [ styles.button, { width: '25%' } ] }>
            { buttonsEnabled && this.renderButton('arrow-forward', this.onFuturePress, styles.icon) }
          </View>
        </View>
        <Animated.View style={[styles.calendarWidget, { top: this.state.slideCalendarAnim }]}>
          <Calendar
            current={selectedDate.format('YYYY-MM-DD')}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={({ dateString }) => {this.onDateSelect(moment(dateString))}}
            theme={{
              textSectionTitleColor: primaryColor,
              selectedDayBackgroundColor: primaryColor,
              selectedDayTextColor: whiteColor,
              arrowColor: primaryColor,
              monthTextColor: primaryColor,
              textDayFontSize: 18,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 18,
            }}
          />
        </Animated.View>
      </View>
    )
  }
}

export default DateSelectHeader
