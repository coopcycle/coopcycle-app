import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Form, Item, Input, InputGroup, Label, Button, Text } from 'native-base'

export default class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: undefined,
      password: undefined,
    }
  }

  onSubmit() {
    const { email, password } = this.state
    const { onSubmit } = this.props

    if (onSubmit) {
      onSubmit(email, password)
    }
  }

  render() {
    return (
      <View>
        <Form>
          <Item stackedLabel>
            <Label>Nom d'utilisateur</Label>
            <Input ref="email"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={ (email) => this.setState({ email }) }
              style={{ height: 40 }} />
          </Item>
          <Item stackedLabel>
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
