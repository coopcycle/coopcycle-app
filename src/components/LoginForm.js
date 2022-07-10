import React, { Component } from 'react'
import { Platform, View } from 'react-native'
import { connect } from 'react-redux'
import { Box, Button, FormControl, Input, Stack, Text } from 'native-base'
import { Formik } from 'formik'
import _ from 'lodash'
import { withTranslation } from 'react-i18next'
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next'
import Config from 'react-native-config'
import { AppleButton, appleAuth } from '@invertase/react-native-apple-authentication'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin'

import FacebookButton from './FacebookButton'
import { googleSignIn, loginWithFacebook, signInWithApple } from '../redux/App/actions'

class LoginForm extends Component {

  constructor(props) {
    super(props)

    this._passwordInput = null
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      Settings.setAppID(Config.FACEBOOK_APP_ID)
    }
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

    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ], // [Android] what API you want to access on behalf of the user, default is email and profile
      webClientId: Config.GOOGLE_SIGN_IN_CLIENT_ID, // client ID of type WEB for your server (needed to verify user ID and offline access)
      // offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      // hostedDomain: '', // specifies a hosted domain restriction
      // forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
      // accountName: '', // [Android] specifies an account name on the device that should be used
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
      // googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
      // openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
      // profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
    });

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
              onSubmitEditing={ () => this._passwordInput.focus() }
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
          { this.props.withFacebook ? (
            <Box mt="2">
              <Box mb="2">
                <FacebookButton
                  onPress={ () => {
                    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
                      (result) => {
                        if (result.isCancelled) {
                          console.log('Login cancelled')
                        } else {
                          // Cross-platform way of retrieving email
                          // https://github.com/thebergamo/react-native-fbsdk-next#get-profile-information
                          // https://github.com/thebergamo/react-native-fbsdk-next/issues/78#issuecomment-888085735
                          AccessToken.getCurrentAccessToken().then(
                            (data) => this.props.loginWithFacebook(data.accessToken.toString())
                          )
                        }
                      },
                      (error) => {
                        console.log(error);
                      }
                    )
                  }} />
              </Box>
              { Platform.OS === 'ios' && (
              <AppleButton
                buttonStyle={AppleButton.Style.WHITE}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                  width: '100%', // You must specify a width
                  height: 40, // You must specify a height
                }}
                onPress={ () => {
                  appleAuth.performRequest({
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
                  }).then(appleAuthRequestResponse => {

                    const identityToken = appleAuthRequestResponse.identityToken

                    // get current authentication state for user
                    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
                    appleAuth
                      .getCredentialStateForUser(appleAuthRequestResponse.user)
                      .then(credentialState => {
                        console.log('credentialState', credentialState)
                        // use credentialState response to ensure the user is authenticated
                        if (credentialState === appleAuth.State.AUTHORIZED) {
                          // user is authenticated
                          this.props.signInWithApple(identityToken)
                        }
                      })
                  })
                }} />
              )}
            </Box>
          ) : null }
          { this.props.withGoogle ? (
          <GoogleSigninButton
            style={{
              width: '100%',
              height: 40,
            }}
            size={ GoogleSigninButton.Size.Wide }
            color={ GoogleSigninButton.Color.Dark }
            onPress={ () => {
              GoogleSignin.hasPlayServices()
                .then(() => {
                  GoogleSignin.signIn()
                    .then((userInfo) => {
                      this.props.googleSignIn(userInfo.idToken)
                    })
                    .catch(e => console.log(e))
                })
                .catch(e => console.log(e))
            }}
            disabled={ false } />
          ) : null }
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

function mapDispatchToProps(dispatch) {
  return {
    loginWithFacebook: (accessToken) => dispatch(loginWithFacebook(accessToken)),
    signInWithApple: (identityToken) => dispatch(signInWithApple(identityToken)),
    googleSignIn: (idToken) => dispatch(googleSignIn(idToken)),
  }
}

export { LoginForm }
export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(LoginForm))
