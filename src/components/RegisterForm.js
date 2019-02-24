import React from 'react'
import { TextInput, TouchableOpacity, StyleSheet, View } from 'react-native'
import { Form, Item, Input, Label, Button, Icon, Text } from 'native-base'
import { withNamespaces } from 'react-i18next'
import validate from 'validate.js'
import { PhoneNumberUtil } from 'google-libphonenumber'
import phoneNumberExamples from 'libphonenumber-js/examples.mobile.json'
import {
  getExampleNumber,
  parsePhoneNumberFromString,
  AsYouType } from 'libphonenumber-js'
import Flag from '../components/Flag'
import _ from 'lodash'

import i18n from '../i18n'
import Settings from '../Settings'

const phoneUtil = PhoneNumberUtil.getInstance()

validate.validators.phoneNumber = (value, options, key, attributes) => {

  if (!value) {

    return options.message
  }

  const country = Settings.get('country').toUpperCase()

  const phoneNumber = parsePhoneNumberFromString(value, country)
  if (phoneNumber) {

    return phoneNumber.isValid() ? null : options.message
  }
}

// Custom validator for matches
// Checks whether the given value matches another value in the object under validation
// Used for password confirmation checks
validate.validators.matches = (value, options, key, attributes) =>
  value === attributes[options.key]
    ? null
    : options.message

const inputs = [
  {
    name: 'email',
    label: i18n.t('EMAIL'),
    props: {
      keyboardType: 'email-address',
    },
    constraints: {
      presence: { message: i18n.t('INVALID_EMAIL') },
      email: {
        message: i18n.t('INVALID_EMAIL'),
      },
    }
  },
  {
    name: 'username',
    label: i18n.t('USERNAME'),
    constraints: {
      presence: { message: i18n.t('INVALID_USERNAME') },
      // https://github.com/coopcycle/coopcycle-web/blob/82220bc36dd3c44e6e770abee022c6f736f4228c/src/AppBundle/Entity/ApiUser.php#L40-L45
      length: {
        minimum: 3,
        maximum: 15,
        message: i18n.t('INVALID_USERNAME'),
      },
      format: {
        pattern: /^[a-zA-Z0-9_]{3,15}$/,
        message: i18n.t('INVALID_USERNAME_FORMAT'),
      },
    }
  },
  {
    name: 'password',
    label: i18n.t('PASSWORD'),
    props: {
      secureTextEntry: true,
    },
    constraints: {
      presence: { message: i18n.t('INVALID_PASSWORD') },
      // https://github.com/FriendsOfSymfony/FOSUserBundle/blob/ee76c57c6a0966c24f4f9a693790ecd61bf2ddce/Resources/config/validation.xml#L65-L75
      length: {
        minimum: 8,
        maximum: 4096,
        message: i18n.t('INVALID_PASSWORD'),
      },
    }
  },
  {
    name: 'passwordConfirmation',
    label: i18n.t('CONFIRM_PASSWORD'),
    props: {
      secureTextEntry: true,
    },
    constraints: {
      presence: { message: i18n.t('INVALID_PASSWORD_CONFIRMATION') },
      matches: {
        key: 'password',
        message: i18n.t('INVALID_PASSWORD_CONFIRMATION'),
      }
    }
  },
  {
    name: 'givenName',
    label: i18n.t('GIVEN_NAME'),
    constraints: {
      presence: { message: i18n.t('INVALID_GIVEN_NAME') },
      length: {
        minimum: 1,
        message: i18n.t('INVALID_GIVEN_NAME'),
      }
    }
  },
  {
    name: 'familyName',
    label: i18n.t('FAMILY_NAME'),
    constraints: {
      presence: { message: i18n.t('INVALID_FAMILY_NAME') },
      length: {
        minimum: 1,
        message: i18n.t('INVALID_FAMILY_NAME'),
      }
    }
  },
  {
    name: 'telephone',
    label: i18n.t('PHONE_NUMBER'),
    props: {
      keyboardType: 'phone-pad',
    },
    constraints: {
      presence: { message: i18n.t('INVALID_PHONE_NUMBER') },
      phoneNumber: {
        message: i18n.t('INVALID_PHONE_NUMBER'),
      },
    }
  }
]

const constraints = _.reduce(
  inputs,
  (acc, { name, constraints }) => ({ ...acc, [name]: constraints }),
  {}
)

class RegisterForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      givenName: this.props.prefill === true ? 'John' : '',
      familyName: this.props.prefill === true ? 'Doe' : '',
      email: this.props.prefill === true ? 'john.doe@coopcycle.org' : '',
      telephone: this.props.prefill === true ? '+33612345678' : '',
      username: this.props.prefill === true ? 'johndoe' : '',
      password: this.props.prefill === true ? '12345678' : '',
      passwordConfirmation: this.props.prefill === true ? '12345678' : '',
      errors: {}
    }
  }

  _onSubmit() {

    const { errors, ...data } = this.state
    const newErrors = validate(data, constraints, { fullMessages: false })

    if (newErrors) {
      this.setState({
        errors: newErrors
      })

      return
    }

    const country = Settings.get('country').toUpperCase()
    const phoneNumber = parsePhoneNumberFromString(data.telephone, country)

    const newData = {
      ...data,
      telephone: phoneNumber.format('E.164')
    }

    this.props.onSubmit(newData)
  }

  _onChangeTelephone(value) {

    const country = Settings.get('country').toUpperCase()

    this.setState({
      telephone: new AsYouType(country).input(value)
    })
  }

  renderErrors(errors) {

    return (
      <View>
        { errors.map((message, key) => (<Text key={ key } note style={{ marginLeft: 15, color: '#ed2f2f' }}>{ message }</Text>)) }
      </View>

    )
  }

  render() {

    const { errors } = this.state
    const country = Settings.get('country').toUpperCase()

    return (
      <View>
        <Form>
          { inputs.map(input => {

            const hasErrors = errors.hasOwnProperty(input.name)
            const itemProps = hasErrors ? { error: true } : {}

            if (input.name === 'telephone') {

              // phoneUtil.getCountryCodeForRegion('FR')

              const telephoneInputStyle = [ styles.telephoneInput ]
              if (hasErrors) {
                telephoneInputStyle.push(styles.telephoneInputError)
              }

              const phoneNumberExample = getExampleNumber(country, phoneNumberExamples)

              // @see https://github.com/jackocnr/intl-tel-input
              // @see https://medium.com/devopslinks/building-an-international-react-native-phone-input-with-expo-and-native-base-9040d935e206
              return (
                <View key={ input.name }>
                  <View style={ styles.telephoneItem }>
                    <Label style={ styles.stackedLabel }>{ input.label }</Label>
                    <View style={ telephoneInputStyle }>
                      <View>
                        <TouchableOpacity style={ styles.telephoneCodeBtn }>
                          <Flag country={ country } width={ 30 } height={ 20 } />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        defaultValue={ this.state[input.name] }
                        value={ this.state[input.name] }
                        placeholder={ phoneNumberExample.formatNational() }
                        autoCorrect={ false }
                        autoCapitalize="none"
                        style={{ flex: 1, height: 40, fontSize: 18 }}
                        onChangeText={ this._onChangeTelephone.bind(this) }
                        { ...input.props } />
                    </View>
                  </View>
                  { hasErrors && this.renderErrors(errors[input.name]) }
                </View>
              )
            }

            return (
              <View key={ input.name }>
                <Item stackedLabel { ...itemProps }>
                  <Label>{ input.label }</Label>
                  <Input
                    defaultValue={ this.state[input.name] }
                    autoCorrect={ false }
                    autoCapitalize="none"
                    style={{ height: 40 }}
                    onChangeText={ value => this.setState({ [input.name]: value }) }
                    { ...input.props } />
                </Item>
                { hasErrors && this.renderErrors(errors[input.name]) }
              </View>
            )
          }) }
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

const styles = StyleSheet.create({
  telephoneItem: {
    marginLeft: 15,
  },
  telephoneInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  telephoneInputError: {
    borderBottomColor: '#ed2f2f',
    borderBottomWidth: 1
  },
  telephoneCodeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e7e7e7',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  stackedLabel: {
    fontSize: 15,
    color: '#575757',
    marginTop: 10,
    marginBottom: 5,
  }
})

export default withNamespaces('common')(RegisterForm)
