import React from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { Icon, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { LocaleConfig, Calendar } from 'react-native-calendars'
import moment from 'moment/min/moment-with-locales'
import { localeDetector } from '../i18n'

import { primaryColor, whiteColor, dateSelectHeaderHeight, headerFontSize } from "../styles/common"

const LOCALE = localeDetector()

moment.locale(LOCALE)

LocaleConfig.locales[LOCALE] = {
  monthNames: moment.months(),
  monthNamesShort: moment.monthsShort(),
  dayNames: moment.weekdays(),
  dayNamesShort: moment.weekdaysMin()
};

LocaleConfig.defaultLocale = LOCALE;

let styles = StyleSheet.create({
  container: {
    zIndex: 10,
    height: dateSelectHeaderHeight
  },
  dateHeader: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
    alignItems: 'center'
  },
  dateHeaderText: {
    color: whiteColor,
    paddingHorizontal: 15,
    fontSize: headerFontSize
  },
  icon: {
    color: whiteColor,
    fontSize: 32
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
    position: 'absolute',
    right: 0,
    left: 0,
    zIndex: -1,
    height: 300 // workaround for https://github.com/wix/react-native-calendars/issues/338
  }
})

class DateSelectHeader extends React.Component {

  constructor(props) {
    super(props)

    this.initialCalendarTop = -400

    this.state = {
      slideCalendarAnim: new Animated.Value(this.initialCalendarTop),
      showCalendar: false
    }

    this.toggleCalendar = this.toggleCalendar.bind(this)
    this.onDateSelect = this.onDateSelect.bind(this)
    this.onFuturePress = this.onFuturePress.bind(this)
    this.onPastPress = this.onPastPress.bind(this)
  }

  toggleCalendar() {
    const { showCalendar } = this.state
    this.setState({ showCalendar: !showCalendar })
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

  openCalendar() {
    Animated.timing(
      this.state.slideCalendarAnim,
      {
        toValue: 40,
        duration: 450,
      }
    ).start()
  }

  closeCalendar() {
    Animated.timing(
      this.state.slideCalendarAnim,
      {
        toValue: this.initialCalendarTop,
        duration: 350,
      }
    ).start()
  }

  renderButton(iconName, onPress, style) {
    return (
      <Button block transparent onPress={ onPress }>
        <Icon style={style} name={ iconName }></Icon>
      </Button>
    )
  }

  onDateSelect(selectedDate) {
    const { toDate } = this.props
    this.closeCalendar()
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
        <Grid>
          <Row style={ styles.dateHeader }>
            <Col size={ 4 } style={ styles.button }>
              { buttonsEnabled && this.renderButton('arrow-dropleft', this.onPastPress, styles.icon) }
            </Col>
            <Col size={ 8 } style={ styles.body } onPress={ this.toggleCalendar }>
              <Text style={styles.dateHeaderText}>{selectedDate.format('dddd Do MMM')}</Text>
            </Col>
            <Col size={ 4 } style={ styles.button }>
              { buttonsEnabled && this.renderButton('arrow-dropright', this.onFuturePress, styles.icon) }
            </Col>
          </Row>
        </Grid>
        <Animated.View style={[styles.calendarWidget, {top: this.state.slideCalendarAnim}]}>
          <Calendar
            current={selectedDate.format('YYYY-MM-DD')}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={({dateString}) => {this.onDateSelect(moment(dateString))}}
            theme={{
              textSectionTitleColor: primaryColor,
              selectedDayBackgroundColor: primaryColor,
              selectedDayTextColor: whiteColor,
              arrowColor: primaryColor,
              monthTextColor: primaryColor,
              textDayFontSize: 18,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 18
            }}
          />
        </Animated.View>
      </View>
    )
  }
}

export default DateSelectHeader
