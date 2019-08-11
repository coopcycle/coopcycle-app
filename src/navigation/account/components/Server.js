import React, { Component } from 'react'
import { View } from 'react-native'
import {
  Text, Button
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { resetServer } from '../../../redux/App/actions'

class Server extends Component {

  render() {

    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={{ textAlign: 'center' }}>
          {
            [
              this.props.t('CONNECTED_TO'),
              ' ',
              <Text key={ 3 } style={{ fontWeight: 'bold' }}>{ this.props.baseURL }</Text>
            ]
          }
        </Text>
        <Button block transparent onPress={ () => this.props.resetServer() }>
          <Text>{ this.props.t('CHANGE_SERVER') }</Text>
        </Button>
      </View>
    )
  }
}

function mapStateToProps(state) {

  return {
    baseURL: state.app.baseURL,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    resetServer: () => dispatch(resetServer()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Server))
