import React, { Component } from 'react'
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { Icon, Text, H3 } from 'native-base'
import { withTranslation } from 'react-i18next'

class DatePickerHeader extends Component {

  render() {

    const { width } = Dimensions.get('window')
    const { date } = this.props

    let dateFormat = 'L'
    if (width > 400) {
      dateFormat = 'dddd LL'
    }

    return (
      <Grid style={ styles.container }>
        <Row>
          <Col size={ 8 }>
            <TouchableOpacity onPress={ () => this.props.onCalendarClick() }>
              <View style={ [ styles.wrapper, styles.buttonLeft ] }>
                <Icon type="FontAwesome" name="calendar" />
                <H3>{ date.format(dateFormat) }</H3>
                <Icon type="FontAwesome" name="chevron-right" style={{ color: '#ddd' }} />
              </View>
            </TouchableOpacity>
          </Col>
          <Col size={ 4 }>
            <TouchableOpacity onPress={ () => this.props.onTodayClick() }>
              <View style={ [ styles.wrapper, styles.buttonRight ] }>
                <Icon type="FontAwesome" name="refresh" />
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
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
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

export default withTranslation()(DatePickerHeader)
