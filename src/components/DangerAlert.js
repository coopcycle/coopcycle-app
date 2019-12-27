import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon, Text } from 'native-base'
import { withTranslation } from 'react-i18next'

class DangerAlert extends Component {
  render() {

    const rowStyle = [ styles.row ]
    if (!this.props.onClose) {
      rowStyle.push({
        justifyContent: 'center'
      })
    }

    return (
      <View style={ styles.container }>
        <View style={ rowStyle }>
          <Text style={ styles.text }>{ this.props.text }</Text>
          { this.props.onClose && (
            <TouchableOpacity onPress={ () => this.props.onClose() }>
              <Icon name="close" style={{ color: '#a94442' }} />
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
    paddingHorizontal: 20,
    backgroundColor: '#f2dede',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#a94442',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#a94442',
    textAlign: 'center',
    fontSize: 14,
  },
})

export default withTranslation()(DangerAlert)
