import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import { withTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {blueColor} from '../styles/common';

class DangerAlert extends Component {
  render() {

    const rowStyle = [ styles.row ]
    if (!this.props.onClose) {
      rowStyle.push({
        justifyContent: 'center',
      })
    }

    return (
      <View style={ styles.container }>
        <View style={ rowStyle }>
          <Text style={ styles.text } adjustsFontSizeToFit={this.props.adjustsFontSizeToFit}>{ this.props.text }</Text>
          { this.props.onClose && (
            <TouchableOpacity onPress={ () => this.props.onClose() }>
              <Icon as={Ionicons} name="close" style={{ color: blueColor }} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    paddingHorizontal: 8,
    backgroundColor: '#d9edf7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#bce8f1',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#31708f',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
  },
})

export default withTranslation()(DangerAlert)
