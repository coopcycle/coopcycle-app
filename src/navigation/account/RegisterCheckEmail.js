import React, { Component } from 'react'
import {
  View,
} from 'react-native'
import { CommonActions } from '@react-navigation/native'
import {
  Button, Center, Icon, Text,
} from 'native-base'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

class RegisterCheckEmail extends Component {

  _onPressLogin() {

    const loginRouteName =
      this.props.route.params?.loginRouteName || 'AccountHome'

    const resetAction = CommonActions.reset({
      index: 0,
      routes: [
        { name: loginRouteName },
      ],
    })

    this.props.navigation.dispatch(resetAction)
  }

  render() {

    const email = this.props.route.params?.email || ''

    return (
      <Center flex={ 1 } testID="registerCheckEmail">
        <Icon as={ FontAwesome } name="envelope-o" mb="3" />
        <Text style={{ textAlign: 'center' }}>
          { this.props.t('REGISTER_CHECK_EMAIL_DISCLAIMER', { email }) }
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center' }} note>
            { this.props.t('REGISTER_CHECK_EMAIL_ALREADY_ACTIVATED') }
          </Text>
          <Button block transparent onPress={ () => this._onPressLogin() }>
            <Text>{ this.props.t('REGISTER_CHECK_EMAIL_LOGIN') }</Text>
          </Button>
        </View>
      </Center>
    )
  }
}

export default withTranslation()(RegisterCheckEmail)
