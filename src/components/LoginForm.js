import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Container, Form, Item, Input, Label, Button, Text } from 'native-base'
import { withNamespaces } from 'react-i18next'

class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: undefined,
      password: undefined,
    }
  }

  _onSubmit() {
    const { email, password } = this.state
    this.props.onSubmit(email, password)
  }

  render() {

    const itemProps = this.props.hasErrors ? { error: true } : {}

    return (
      <View>
        <Form>
          <Item stackedLabel { ...itemProps }>
            <Label>{this.props.t('USERNAME')}</Label>
            <Input ref="email"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={ email => this.setState({ email }) }
              style={{ height: 40 }} />
          </Item>
          <Item stackedLabel { ...itemProps }>
            <Label>{this.props.t('PASSWORD')}</Label>
            <Input ref="password"
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={ password => this.setState({ password }) }
              style={{ height: 40 }} />
          </Item>
        </Form>
        <View style={{ marginTop: 20 }}>
          <Button block onPress={ this._onSubmit.bind(this) }>
            <Text>{this.props.t('SUBMIT')}</Text>
          </Button>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {

  return {
    hasErrors: state.app.lastAuthenticationError,
  }
}

export { LoginForm }
export default connect(mapStateToProps)(withNamespaces('common')(LoginForm))
