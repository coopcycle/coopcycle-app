import React, { Component } from 'react'
import { InteractionManager, View } from 'react-native'
import { connect } from 'react-redux'
import {
  Button, Center,
  FormControl, Input, Stack,
} from 'native-base'
import { withTranslation } from 'react-i18next'

import { selectServer } from '../../redux/App/actions'

class CustomServer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      text: '',
      serverError: false,
      errorMessage: '',
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(_ => setTimeout(() => this.input.focus(), 500))
  }

  handleForm() {
    this.props.selectServer(this.state.text.trim())
  }

  render() {

    const itemProps = { isInvalid: this.props.hasError }

    return (
      <Center flex={1} px="3">
        <FormControl { ...itemProps }>
          <Stack>
            <Input
              ref={(ref) => { this.input = ref }}
              autoCapitalize={'none'}
              autoCorrect={false}
              placeholder={`${this.props.t('EXAMPLE')} : demo.coopcycle.org`}
              onChangeText={(text) => this.setState({ text })}
              returnKeyType="done"
              onSubmitEditing={ this.handleForm.bind(this) }
              testID="customServerURL"
              autoCompleteType="off" />
          </Stack>
          { this.props.hasError && (
          <FormControl.ErrorMessage>
            { this.props.message }
          </FormControl.ErrorMessage>
          ) }
          <View style={{ paddingVertical: 15 }}>
            <Button block onPress={ this.handleForm.bind(this) } testID="submitCustomServer">
              { this.props.t('SUBMIT') }
            </Button>
          </View>
        </FormControl>
      </Center>
    )
  }
}

function mapStateToProps(state) {

  return {
    hasError: !!state.app.selectServerError,
    message: state.app.selectServerError,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    selectServer: server => dispatch(selectServer(server)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(CustomServer))
