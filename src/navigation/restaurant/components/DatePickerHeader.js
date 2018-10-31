import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Icon, Text } from 'native-base'
import { translate } from 'react-i18next'

class DatePickerHeader extends Component {
  render() {

    const { date } = this.props

    return (
      <Grid style={{ borderBottomWidth: 1, borderBottomColor: '#000' }}>
        <Row>
          <Col size={ 8 }>
            <TouchableOpacity onPress={ () => this.props.onCalendarClick() }>
              <View style={ [ styles.wrapper, styles.buttonLeft ] }>
                <Icon name="calendar" />
                <Text>{ date.format('dddd LL') }</Text>
              </View>
            </TouchableOpacity>
          </Col>
          <Col size={ 4 }>
            <TouchableOpacity onPress={ () => this.props.onTodayClick() }>
              <View style={ [ styles.wrapper, styles.buttonRight ] }>
                <Icon name="refresh" />
                <Text>{ this.props.t('TODAY') }</Text>
              </View>
            </TouchableOpacity>
          </Col>
        </Row>
      </Grid>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  buttonRight: {
    justifyContent: 'space-around',
    backgroundColor: '#2ECC71',
  },
  buttonLeft: {
    justifyContent: 'space-between',
  },
})

export default translate()(DatePickerHeader)
