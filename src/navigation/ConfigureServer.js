import React, { Component } from 'react'
import {
  View,
  ActivityIndicator,
  StyleSheet
} from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail,
  Form, Item, Input, Label,
  Card, CardItem,
  Toast
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import API from '../API'
import Settings from '../Settings'
import { setBaseURL } from '../redux/App/actions'

class ConfigureServer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      server: null,
      text: '',
      serverError: false,
    }

    this.handleForm = this.handleForm.bind(this)
  }

  handleForm() {
    const server = this.state.text.trim()

    this.setState({ loading: true, serverError: false })

    API.checkServer(server)
      .then(baseURL => {

        Settings
          .saveServer(baseURL)
          .then(() => Settings.synchronize(baseURL))
          .then(() => this.props.setBaseURL(baseURL))
          .then(() => this.setState({ loading: false, serverError: false }))
          .then(() => this.props.navigation.navigate({
            routeName: 'Home',
            key: 'Home',
            params: { baseURL }
          }))

      })
      .catch((err) => {

        setTimeout(() => {

          let message = this.props.t('TRY_LATER')
          let serverError = false
          if (err.message) {
            if (err.message === 'Network request failed') {
              message = this.props.t('NET_FAILED')
            }
            if (err.message === 'Not a CoopCycle server') {
              message = this.props.t('SERVER_INCOMPATIBLE')
              serverError = true
            }
            if (err.message === 'Hostname is not valid') {
              message = this.props.t('SERVER_INVALID')
              serverError = true
            }
          }

          Toast.show({
            text: message,
            position: 'bottom',
            type: 'danger',
            duration: 3000
          })

          this.input._root.clear()
          this.input._root.focus()

          this.setState({ loading: false, serverError })

        }, 500)

      })
  }

  render() {

    let loader = (
      <View />
    )
    if (this.state.loading) {
      loader = (
        <View style={styles.loader}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{`${this.props.t('LOADING')}...`}</Text>
        </View>
      )
    }

    const itemProps = this.state.serverError ? { error: true } : {}

    return (
      <Container>
        <Header>
          <Left />
          <Body>
            <Title>CoopCycle</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={{ marginHorizontal: 10, marginTop: 20 }}>
            <Card>
              <CardItem>
                <Body>
                <Text>
                  {`${this.props.t('CHOOSE_SERVER')}.`}
                </Text>
                </Body>
              </CardItem>
            </Card>
          </View>
          <Form style={{ marginVertical: 30 }}>
            <Item stackedLabel last { ...itemProps }>
              <Label>{this.props.t('SERVER_URL')}</Label>
              <Input
                ref={(ref) => { this.input = ref }}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholder={`${this.props.t('EXAMPLE')} : demo.coopcycle.org`}
                onChangeText={(text) => this.setState({ text })} />
            </Item>
          </Form>
          <View style={{ paddingHorizontal: 10 }}>
            <Button block onPress={ this.handleForm }>
              <Text>{this.props.t('SUBMIT')}</Text>
            </Button>
          </View>
        </Content>
        { loader }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)',
    zIndex: 20
  },
})

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    setBaseURL: baseURL => dispatch(setBaseURL(baseURL)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(ConfigureServer))
