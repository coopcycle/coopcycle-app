import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Icon, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'

import { primaryColor, whiteColor, dateSelectHeaderHeight, headerFontSize } from "../styles/common"

let styles = StyleSheet.create({
  dateHeader: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
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
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})

class DateSelectHeader extends React.Component {

  renderButton(iconName, onPress) {
    return (
      <Button block transparent onPress={ onPress }>
        <Icon style={styles.icon} name={ iconName }></Icon>
      </Button>
    )
  }

  render () {
    let { toPastDate, toFutureDate, selectedDate, buttonsEnabled } = this.props

    return (
      <View style={ styles.dateHeader }>
        <Grid>
          <Row>
            <Col size={ 2 } style={ styles.button }>
            { buttonsEnabled && this.renderButton('arrow-dropleft', toPastDate) }
            </Col>
            <Col size={ 6 } style={ styles.body }>
              <Text style={styles.dateHeaderText}>{selectedDate.format('dddd Do MMM')}</Text>
            </Col>
            <Col size={ 2 } style={ styles.button }>
            { buttonsEnabled && this.renderButton('arrow-dropright', toFutureDate) }
            </Col>
          </Row>
        </Grid>
      </View>
    )
  }
}

export default DateSelectHeader