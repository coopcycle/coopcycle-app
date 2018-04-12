import React from 'react'
import { View } from 'react-native'
import { Form, Item, Input, Label, Button, Text } from 'native-base'
import { translate } from 'react-i18next'


class RegisterForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      givenName: null,
      familyName: null,
      email: null,
      telephone: null,
      username: null,
      password: null,
      passwordConfirmation: null,
      error: false,
    }
  }

  onSubmit() {
    const { error, ...data } = this.state
    const { client, onRequestStart, onRequestEnd, onRegisterSuccess, onRegisterFail } = this.props
    onRequestStart()
    client.register(data)
      .then(user => {
        onRequestEnd()
        onRegisterSuccess(user)
      })
      .catch(err => {
        onRequestEnd()
        // TODO: What error codes can be expected? 400, 409, ...?
        //       Better error handling once this is clarified
        onRegisterFail(err.message)
      })
  }

  render() {
    return (
      <View>
        <Form>
          <Item stackedLabel>
            <Label>{this.props.t('GIVEN_NAME')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalise="none"
              onChangeText={givenName => this.setState({ givenName })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('FAMILY_NAME')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalise="none"
              onChangeText={familyName => this.setState({ familyName })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('EMAIL')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalise="none"
              keyboardType="email-address"
              onChangeText={email => this.setState({ email })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('PHONE_NUMBER')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalise="none"
              keyboardType="phone-pad"
              onChangeText={telephone => this.setState({ telephone })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('USERNAME')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalise="none"
              onChangeText={username => this.setState({ username })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('PASSWORD')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalise="none"
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('CONFIRM_PASSWORD')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalise="none"
              secureTextEntry={true}
              onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
              style={{ height: 40 }}
            />
          </Item>
        </Form>
        <View style={{ paddingHorizontal: 10, marginTop: 20 }}>
          <Button block onPress={() => this.onSubmit()}>
            <Text>{this.props.t('SUBMIT')}</Text>
          </Button>
        </View>
      </View>
    )
  }
}


export default translate()(RegisterForm)
