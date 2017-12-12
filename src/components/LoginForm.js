import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Form, Item, Input, InputGroup, Label, Button, Text } from 'native-base'

export default class LoginForm extends Component {

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
          onLoginFail('Utilisateur et/ou mot de passe inexistant.')
        } else {
          onLoginFail('Veuillez réessayer plus tard')
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
            <Label>Nom d'utilisateur</Label>
            <Input ref="email"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={ (email) => this.setState({ email }) }
              style={{ height: 40 }} />
          </Item>
          <Item stackedLabel { ...itemProps }>
            <Label>Mot de passe</Label>
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
            <Text>Valider</Text>
          </Button>
        </View>
      </View>
    )
  }
}
