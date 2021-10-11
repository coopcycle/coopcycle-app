import React, { Component } from 'react'
import { View } from 'react-native'
import {
  Text, Button, Box,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { resetServer } from '../../../redux/App/actions'

class Server extends Component {

  render() {

    return (
      <Box p="2">
        <Text style={{ textAlign: 'center' }}>
          {
            [
              this.props.t('CONNECTED_TO'),
              ' ',
              <Text key={ 3 } style={{ fontWeight: 'bold' }}>{ this.props.baseURL }</Text>,
            ]
          }
        </Text>
        <Button size="sm" variant="link" onPress={ () => this.props.resetServer() }>
          { this.props.t('CHANGE_SERVER') }
        </Button>
      </Box>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Server))
