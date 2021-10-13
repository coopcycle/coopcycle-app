import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { Stack, FormControl, Input, Button, Text } from 'native-base'
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

    if (_.isEmpty(values.email)) {
      errors.email = true
    }

    if (_.isEmpty(values.password)) {
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
        <Stack>
          <FormControl error={ (touched.email && errors.email) || this.props.hasErrors }>
            <FormControl.Label>{this.props.t('USERNAME')}</FormControl.Label>
            <Input
              testID="loginUsername"
              autoCorrect={ false }
              autoCapitalize="none"
              style={{ height: 40 }}
              returnKeyType="next"
              onChangeText={ handleChange('email') }
              onBlur={ handleBlur('email') }
              // onSubmitEditing={ () => this._passwordInput._root.focus() }
            />
          </FormControl>
          <FormControl error={ (touched.password && errors.password) || this.props.hasErrors }>
            <FormControl.Label>{this.props.t('PASSWORD')}</FormControl.Label>
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
          </FormControl>
          <Button size="sm" variant="link" onPress={ () => this.props.onForgotPassword() }>
            {this.props.t('FORGOT_PASSWORD')}
          </Button>
          <View style={{ marginTop: 20 }}>
            <Button block onPress={ handleSubmit } testID="loginSubmit">
              { this.props.t('SUBMIT') }
            </Button>
          </View>
        </Stack>
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
