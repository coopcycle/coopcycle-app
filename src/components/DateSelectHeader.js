import React from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Icon } from 'native-base'
import moment from 'moment'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { dateSelectHeaderHeight, headerFontSize, primaryColor, whiteColor } from '../styles/common'
import { Calendar } from './Calendar'

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
    height: 100, // not a real height, just a workaround for https://github.com/wix/react-native-calendars/issues/338
  },
})

const INITIAL_CALENDAR_HEIGHT = 500 // large enough number to make sure the calendar is hidden on the first render
const EXTRA_CALENDAR_HEIGHT = 100 // some months have more rows than others, add an extra space to make sure the calendar is hidden while switching months

class DateSelectHeader extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      calendarHeight: INITIAL_CALENDAR_HEIGHT,
      slideCalendarAnim: new Animated.Value(-1 * INITIAL_CALENDAR_HEIGHT),
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

    this.setState(Object.assign({}, this.state, {
      showCalendar: !showCalendar,
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
        toValue: -1 * (this.state.calendarHeight + EXTRA_CALENDAR_HEIGHT),
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
      <View style={ styles.container }>
        <View style={ styles.dateHeader }>
          <View style={ [ styles.button, { width: '25%' }] }>
            { buttonsEnabled && this.renderButton('arrow-back', this.onPastPress, styles.icon) }
          </View>
          <TouchableOpacity style={ [ styles.body, { width: '50%' }] } onPress={ this.toggleCalendar }>
            <Text numberOfLines={ 1 } style={styles.dateHeaderText}>
              { moment(selectedDate).format('dddd Do MMM') }
            </Text>
          </TouchableOpacity>
          <View style={ [ styles.button, { width: '25%' }] }>
            { buttonsEnabled && this.renderButton('arrow-forward', this.onFuturePress, styles.icon) }
          </View>
        </View>
        <Animated.View style={[ styles.calendarWidget, { top: this.state.slideCalendarAnim }]} >
          <Calendar
            initialDate={ selectedDate.format('YYYY-MM-DD') }
            markedDates={{
              [selectedDate.format('YYYY-MM-DD')]: { selected: true },
            }}
            onDateSelect={(momentDate) => {this.onDateSelect(momentDate)}}
            onLayout={(event) => {
              const { height: currentCalendarHeight } = event.nativeEvent.layout;

              // updating the calendarHeight with the actual height
              if (this.state.calendarHeight !== currentCalendarHeight) {
                this.setState({
                  ...this.state,
                  calendarHeight: currentCalendarHeight,
                })
              }
            }}
          />
        </Animated.View>
      </View>
    )
  }
}

export default DateSelectHeader
