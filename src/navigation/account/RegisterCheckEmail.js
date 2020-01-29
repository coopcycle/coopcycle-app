import React, { Component } from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import {
  Container, Content, Text, Button, Icon,
} from 'native-base'
import { withTranslation } from 'react-i18next'

class RegisterCheckEmail extends Component {

  _onPressLogin() {

    const loginRouteName =
      this.props.navigation.getParam('loginRouteName', 'AccountHome')

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: loginRouteName,
        }),
      ],
    })

    this.props.navigation.dispatch(resetAction)
  }

  render() {

    const email = this.props.navigation.getParam('email', '')

    return (
      <Container>
        <Content padder contentContainerStyle={ styles.content }>
          <Icon type="FontAwesome" name="envelope-o" style={ styles.icon } />
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
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 15,
  },
})

module.exports = withTranslation()(RegisterCheckEmail)
