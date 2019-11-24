import React, { Component } from 'react'
import { InteractionManager, View } from 'react-native'
import { connect } from 'react-redux'
import {
  Container, Content,
  Button, Text, Icon,
  Form, Item, Input,
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
    InteractionManager.runAfterInteractions(_ => setTimeout(() => this.input._root.focus(), 500))
  }

  handleForm() {
    this.props.selectServer(this.state.text.trim())
  }

  render() {

    const itemProps = { error: this.props.hasError }

    return (
      <Container>
        <Content padder scrollEnabled={ false } contentContainerStyle={{ flex: 1, justifyContent: 'center' }}>
          <Form>
            <Item last { ...itemProps }>
              <Input
                ref={(ref) => { this.input = ref }}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholder={`${this.props.t('EXAMPLE')} : demo.coopcycle.org`}
                onChangeText={(text) => this.setState({ text })}
                returnKeyType="done"
                onSubmitEditing={ this.handleForm.bind(this) }
                testID="customServerURL" />
              { this.props.hasError && <Icon name="close-circle" /> }
            </Item>
            { this.props.hasError && (
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ marginVertical: 5, color: '#ed2f2f' }}>{ this.props.message }</Text>
            </View>
            ) }
            <View style={{ paddingVertical: 15 }}>
              <Button block onPress={ this.handleForm.bind(this) } testID="submitCustomServer">
                <Text>{ this.props.t('SUBMIT') }</Text>
              </Button>
            </View>
          </Form>
        </Content>
      </Container>
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
