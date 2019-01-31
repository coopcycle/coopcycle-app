import React from 'react'
import { View } from 'react-native'
import { Form, Item, Input, Label, Button, Text } from 'native-base'
import { translate } from 'react-i18next'
import validate from 'validate.js'
import { PhoneNumberUtil } from 'google-libphonenumber'
import i18n from '../i18n'


const phoneUtil = PhoneNumberUtil.getInstance()

// Custom validator for phone numbers
// `parseAndKeepRawInput` throws exceptions if it receives an un-parseable input
// (including a phone number without a country-code)
validate.validators.phoneNumber = (value, options, key, attributes) => {
  let number = ''

  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(value))
      ? null
      : options.message

  } catch (error) {
    return options.message

  }
}

// Custom validator for matches
// Checks whether the given value matches another value in the object under validation
// Used for password confirmation checks
validate.validators.matches = (value, options, key, attributes) =>
  value === attributes[options.key]
    ? null
    : options.message


class RegisterForm extends React.Component {
  static schema = {
    givenName: {
      presence: { message: i18n.t('INVALID_GIVEN_NAME') },
      length: {
        minimum: 1,
        message: i18n.t('INVALID_GIVEN_NAME'),
      },
    },
    familyName: {
      presence: { message: i18n.t('INVALID_FAMILY_NAME') },
      length: {
        minimum: 1,
        message: i18n.t('INVALID_FAMILY_NAME'),
      },
    },
    email: {
      presence: { message: i18n.t('INVALID_EMAIL') },
      email: {
        message: i18n.t('INVALID_EMAIL'),
      },
    },
    telephone: {
      presence: { message: i18n.t('INVALID_PHONE_NUMBER') },
      phoneNumber: {
        message: i18n.t('INVALID_PHONE_NUMBER'),
      },
    },
    username: {
      presence: { message: i18n.t('INVALID_USERNAME') },
      length: {
        minimum: 2,
        message: i18n.t('INVALID_USERNAME'),
      },
    },
    password: {
      presence: { message: i18n.t('INVALID_PASSWORD') },
      length: {
        minimum: 8,
        message: i18n.t('INVALID_PASSWORD'),
      },
    },
    passwordConfirmation: {
      presence: { message: i18n.t('INVALID_PASSWORD_CONFIRMATION') },
      matches: {
        key: 'password',
        message: i18n.t('INVALID_PASSWORD_CONFIRMATION'),
      }
    },
  }

  constructor(props) {
    super(props)

    this.state = {
      givenName: '',
      familyName: '',
      email: '',
      telephone: '',
      username: '',
      password: '',
      passwordConfirmation: '',
      error: false,
    }
  }

  onSubmit() {
    this.setState({ message: '' })

    const { error, ...data } = this.state
    const { client, onRequestStart, onRequestEnd, onRegisterSuccess, onRegisterFail } = this.props

    const validationErrors = validate(data, RegisterForm.schema, { fullMessages: false })

    if (validationErrors) {
      this.setState({ error: true })
      return onRegisterFail(Object.values(validationErrors)[0])
    }

    onRequestStart()
    client.register(data)
      .then(user => {
        onRequestEnd()
        onRegisterSuccess(user)
      })
      .catch(err => {
        onRequestEnd()

        if (err.status && err.status === 400) {
          this.setState({ error: true });
          onRegisterFail(this.props.t('EMAIL_ALREADY_REGISTERED'));

        } else {
          onRegisterFail(this.props.t('TRY_LATER'))

        }

      })
  }

  render() {
    return (
      <View>
        <Form>
          <Item stackedLabel>
            <Label>{this.props.t('EMAIL')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={email => this.setState({ email })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('USERNAME')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={username => this.setState({ username })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('PASSWORD')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={password => this.setState({ password })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('CONFIRM_PASSWORD')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('GIVEN_NAME')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={givenName => this.setState({ givenName })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('FAMILY_NAME')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={familyName => this.setState({ familyName })}
              style={{ height: 40 }}
            />
          </Item>
          <Item stackedLabel>
            <Label>{this.props.t('PHONE_NUMBER')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="phone-pad"
              onChangeText={telephone => this.setState({ telephone })}
              style={{ height: 40 }}
            />
          </Item>
        </Form>
        <View style={{ marginTop: 20 }}>
          <Button block onPress={() => this.onSubmit()}>
            <Text>{this.props.t('SUBMIT')}</Text>
          </Button>
        </View>
      </View>
    )
  }
}


export default translate()(RegisterForm)
