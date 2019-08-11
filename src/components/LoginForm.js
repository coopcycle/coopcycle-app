import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Form, Item, Input, Label, Button, Text } from 'native-base'
import { withTranslation } from 'react-i18next'

class LoginForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      email: undefined,
      password: undefined,
    }

    this._passwordInput = null
    this._onSubmit.bind(this)
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
            <Input
              testID="loginUsername"
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={ email => this.setState({ email }) }
              style={{ height: 40 }}
              returnKeyType="next"
              onSubmitEditing={ _ => this._passwordInput._root.focus() } />
          </Item>
          <Item stackedLabel { ...itemProps }>
            <Label>{this.props.t('PASSWORD')}</Label>
            <Input
              testID="loginPassword"
              ref={component => this._passwordInput = component}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={ password => this.setState({ password }) }
              style={{ height: 40 }}
              returnKeyType="done"
              onSubmitEditing={ _ => this._onSubmit() }/>
          </Item>
        </Form>
        <View style={{ marginTop: 20 }}>
          <Button block onPress={ () => this._onSubmit() } testID="loginSubmit">
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
export default connect(mapStateToProps)(withTranslation()(LoginForm))
