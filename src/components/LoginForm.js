import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Form, Item, Input, InputGroup, Label, Button, Text } from 'native-base'
import { translate } from 'react-i18next'

class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: undefined,
      password: undefined,
      error: false
    }
  }

  onSubmit() {
    const { email, password } = this.state
    const { client, onRequestStart, onRequestEnd, onLoginSuccess, onLoginFail } = this.props

    this.setState({ error: false })
    onRequestStart()

    client.login(email, password)
      .then(user => {
        onRequestEnd()
        onLoginSuccess(user)
      })
      .catch(err => {
        onRequestEnd()
        if (err.hasOwnProperty('code') && err.code === 401) {
          this.setState({ error: true })
          onLoginFail(this.props.t('INVALID_USER_PASS'))
        } else {
          onLoginFail(this.props.t('TRY_LATER'))
        }
      })
  }

  render() {

    const { error } = this.state

    const itemProps = error ? { error: true } : {}

    return (
      <View>
        <Form>
          <Item stackedLabel { ...itemProps }>
            <Label>{this.props.t('USERNAME')}</Label>
            <Input ref="email"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={ (email) => this.setState({ email }) }
              style={{ height: 40 }} />
          </Item>
          <Item stackedLabel { ...itemProps }>
            <Label>{this.props.t('PASSWORD')}</Label>
            <Input ref="password"
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={ (password) => this.setState({ password }) }
              style={{ height: 40 }} />
          </Item>
        </Form>
        <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
          <Button block onPress={ () => this.onSubmit() }>
            <Text>{this.props.t('SUBMIT')}</Text>
          </Button>
        </View>
      </View>
    )
  }
}

export default translate()(LoginForm)
