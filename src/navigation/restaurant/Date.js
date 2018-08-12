import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  List, ListItem, InputGroup, Input, Icon, Text, Picker, Button
} from 'native-base'

import { LocaleConfig, Calendar } from 'react-native-calendars'
import moment from 'moment/min/moment-with-locales'
import { translate } from 'react-i18next'

import { connect } from 'react-redux'
import { localeDetector } from '../../i18n'
import { changeDate } from '../../redux/Restaurant/actions'

const LOCALE = localeDetector()

moment.locale(LOCALE)

LocaleConfig.locales[LOCALE] = {
  monthNames: moment.months(),
  monthNamesShort: moment.monthsShort(),
  dayNames: moment.weekdays(),
  dayNamesShort: moment.weekdaysMin()
};

LocaleConfig.defaultLocale = LOCALE;

class DateScreen extends Component {

  onDateChange(dateString) {
    const { navigate } = this.props.navigation

    this.props.changeDate(moment(dateString))
    this.props.navigation.goBack()
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>Choose date</Title>
          </Body>
          <Right />
        </Header>
        <Content style={ styles.content }>
          <Calendar
            current={ this.props.date.format('YYYY-MM-DD') }
            onDayPress={ ({ dateString }) => this.onDateChange(dateString) }
            theme={{
              textDayFontSize: 18,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 18,
            }} />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 15
  }
})

function mapStateToProps(state) {
  return {
    user: state.app.user,
    httpClient: state.app.httpClient,
    loading: state.restaurant.isFetching,
    date: state.restaurant.date
  }
}

function mapDispatchToProps(dispatch) {
  return {
    changeDate: date => dispatch(changeDate(date)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(DateScreen))
