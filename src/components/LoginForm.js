import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Form, Item, Input, Label, Button, Text } from 'native-base'
import { Formik } from 'formik'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'

class LoginForm extends Component {

  constructor(props) {
    super(props)

    this._passwordInput = null
  }

  _validate(values) {

    let errors = {}

    if (_.isEmpty(values.email) || this.props.hasErrors) {
      errors.email = true
    }

    if (_.isEmpty(values.password) || this.props.hasErrors) {
      errors.password = true
    }

    return errors
  }

  _onSubmit(values) {
    const { email, password } = values
    this.props.onSubmit(email, password)
  }

  render() {

    const initialValues = {
      email: '',
      password: '',
    }

    return (
      <Formik
        initialValues={ initialValues }
        validate={ this._validate.bind(this) }
        onSubmit={ this._onSubmit.bind(this) }
        validateOnBlur={ false }
        validateOnChange={ false }>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
        <View>
          <Form>
            <Item stackedLabel error={ touched.email && errors.email }>
              <Label>{this.props.t('USERNAME')}</Label>
              <Input
                testID="loginUsername"
                autoCorrect={ false }
                autoCapitalize="none"
                style={{ height: 40 }}
                returnKeyType="next"
                onChangeText={ handleChange('email') }
                onBlur={ handleBlur('email') }
                onSubmitEditing={ () => this._passwordInput._root.focus() } />
            </Item>
            <Item stackedLabel error={ touched.password && errors.password }>
              <Label>{this.props.t('PASSWORD')}</Label>
              <Input
                testID="loginPassword"
                ref={ component => { this._passwordInput = component } }
                autoCorrect={ false }
                autoCapitalize="none"
                secureTextEntry={ true }
                style={{ height: 40 }}
                returnKeyType="done"
                onChangeText={ handleChange('password') }
                onBlur={ handleBlur('password') }
                onSubmitEditing={ handleSubmit }/>
            </Item>
            <Button block transparent onPress={ () => this.props.onForgotPassword() }>
              <Text>{this.props.t('FORGOT_PASSWORD')}</Text>
            </Button>
          </Form>
          <View style={{ marginTop: 20 }}>
            <Button block onPress={ handleSubmit } testID="loginSubmit">
              <Text>{ this.props.t('SUBMIT') }</Text>
            </Button>
          </View>
        </View>
        )}
      </Formik>
    )
  }
}

function mapStateToProps(state) {

  return {
    hasErrors: !!state.app.lastAuthenticationError,
  }
}

export { LoginForm }
export default connect(mapStateToProps)(withTranslation()(LoginForm))
