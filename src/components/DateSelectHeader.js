import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Icon, Container } from 'native-base'

import { primaryColor, whiteColor, dateSelectHeaderHeight, headerFontSize } from "../styles/common"

let styles = StyleSheet.create({
  dateHeader: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  dateHeaderText: {
    color: whiteColor,
    paddingHorizontal: 20,
    fontSize: headerFontSize
  },
  icon: {
    color: whiteColor,
    fontSize: 32
  }
})

class DateSelectHeader extends React.Component {

  render () {
    let { toPastDate, toFutureDate, selectedDate } = this.props

    return (
      <Container>
        <View style={styles.dateHeader}>
          <Icon style={styles.icon} name="arrow-dropleft" onPress={toPastDate}></Icon>
          <Text style={styles.dateHeaderText}>{selectedDate.format('dddd Do MMM')}</Text>
          <Icon style={styles.icon} name="arrow-dropright" onPress={toFutureDate}></Icon>
        </View>
      </Container>
    )
  }
}

export default DateSelectHeader