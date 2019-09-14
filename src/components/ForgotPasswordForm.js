import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Form, Item, Input, Label, Button, Text } from 'native-base'
import { withTranslation } from 'react-i18next'

class ForgotPasswordForm extends Component {

  constructor(props) {
    super(props)

    this.state = {
      username: undefined,
    }

    this._onSubmit.bind(this)
  }

  _onSubmit() {
    const {username} = this.state
    this.props.onSubmit(username)
  }

  render() {
    const itemProps = this.props.hasErrors ? {error: true} : {}

    return (
      <View>
        <Form>
          <Item stackedLabel {...itemProps}>
            <Label>{this.props.t('USERNAME_OR_EMAIL')}</Label>
            <Input
              style={{ height: 40 }}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              onChangeText={username => this.setState({username})}
              onSubmitEditing={_ => this._onSubmit()}
            />
          </Item>
        </Form>
        <View style={{marginTop: 20}}>
          <Button block onPress={() => this._onSubmit()}>
            <Text>{this.props.t('SUBMIT')}</Text>
          </Button>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  //todo is it a correct error to show? (probably not)
  return {
    hasErrors: state.app.lastAuthenticationError,
  }
}

export default connect(mapStateToProps)(withTranslation()(ForgotPasswordForm))
