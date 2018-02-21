import React from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { Icon, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { LocaleConfig, Calendar } from 'react-native-calendars'
import moment from 'moment/min/moment-with-locales'

import { primaryColor, whiteColor, dateSelectHeaderHeight, headerFontSize } from "../styles/common"

moment.locale('fr')

LocaleConfig.locales['fr'] = {
  monthNames: moment.months(),
  monthNamesShort: moment.monthsShort(),
  dayNames: moment.weekdays(),
  dayNamesShort: moment.weekdaysMin()
};

LocaleConfig.defaultLocale = 'fr';

let styles = StyleSheet.create({
  container: {
    zIndex: 10,
    height: dateSelectHeaderHeight
  },
  dateHeader: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
    alignItems: 'center',
    paddingHorizontal: 20
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
  },
  calendarIcon: {
    color: whiteColor,
    fontSize: 26
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
    this.onDateSelect = this.onDateSelect.bind(this)
    this.onFuturePress = this.onFuturePress.bind(this)
    this.onPastPress = this.onPastPress.bind(this)
  }

  onCalendarPress () {
    let { calendarToogled } = this.state

    if (calendarToogled) {
      this.closeCalendar()
    } else {
      Animated.timing(
        this.state.slideCalendarAnim,
        {
          toValue: 40,
          duration: 450,
        }
      ).start()
      this.setState({calendarToogled: true})
    }

  }

  closeCalendar () {

    Animated.timing(
      this.state.slideCalendarAnim,
      {
        toValue: this.initialCalendarTop,
        duration: 350,
      }
    ).start()
    this.setState({calendarToogled: false})
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
            <Col size={ 1 }>
            </Col>
            <Col size={ 2 } style={ styles.button }>
              { buttonsEnabled && this.renderButton('arrow-dropleft', this.onPastPress, styles.icon) }
            </Col>
            <Col size={ 8 } style={ styles.body }>
              <Text style={styles.dateHeaderText}>{selectedDate.format('dddd Do MMM')}</Text>
            </Col>
            <Col size={ 2 } style={ styles.button }>
              { buttonsEnabled && this.renderButton('arrow-dropright', this.onFuturePress, styles.icon) }
            </Col>
            <Col size={ 1 }>
              { buttonsEnabled &&  this.renderButton('calendar', this.onCalendarPress, styles.calendarIcon) }
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