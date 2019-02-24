import React, { Component } from 'react'
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import {
  Container, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem,
  Form, Item, Input, Label,
  Toast
} from 'native-base'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import API from '../API'
import Settings from '../Settings'
import { setBaseURL } from '../redux/App/actions'
import Flag from '../components/Flag'

class ConfigureServer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      text: '',
      serverError: false,
    }

    this.handleForm = this.handleForm.bind(this)
  }

  handleForm() {
    this._selectServer(this.state.text.trim())
  }

  _selectServer(server) {

    this.setState({ loading: true, serverError: false })

    API.checkServer(server)
      .then(baseURL =>

        Settings
          .saveServer(baseURL)
          .then(() => Settings.synchronize(baseURL))
          .then(() => this.props.setBaseURL(baseURL))
          .then(() => this.setState({ loading: false, serverError: false }))
          .then(() => this.props.navigation.navigate({
            routeName: 'CheckoutHome',
            key: 'CheckoutHome',
            params: { baseURL }
          }))

      )
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
        <Content>
          <View style={{ paddingVertical: 20 }}>
            <Text note style={{ textAlign: 'center' }}>
              { this.props.t('CHOOSE_SERVER') }
            </Text>
          </View>
          { this.props.servers.map((server, key) => (
            <TouchableOpacity key={ key } style={ styles.serverItem }
              onPress={ () => this._selectServer(server.coopcycle_url) }>
              <Text>{ `${server.name} - ${server.city}` }</Text>
              <Flag country={ server.country.toUpperCase() } width={ 30 } height={ 20 } />
            </TouchableOpacity>
          )) }
          <View style={{ paddingVertical: 20 }}>
            <Text note style={{ textAlign: 'center' }}>
              { this.props.t('SERVER_URL') }
            </Text>
          </View>
          <Form style={{ marginBottom: 30 }}>
            <Item last { ...itemProps }>
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
  serverItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})

function mapStateToProps(state) {

  return {
    servers: _.filter(state.app.servers, server => server.hasOwnProperty('coopcycle_url'))
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setBaseURL: baseURL => dispatch(setBaseURL(baseURL)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(ConfigureServer))
