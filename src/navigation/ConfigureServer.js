import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import {
  Container, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem,
  Form, Item, Input, Label,
} from 'native-base'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import _ from 'lodash'

import API from '../API'
import Settings from '../Settings'
import { setBaseURL, setLoading } from '../redux/App/actions'
import Flag from '../components/Flag'

class ConfigureServer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      text: '',
      serverError: false,
      errorMessage: '',
    }

    this.handleForm = this.handleForm.bind(this)
  }

  handleForm() {
    this._selectServer(this.state.text.trim())
  }

  _selectServer(server) {

    this.props.setLoading(true)
    this.setState({ serverError: false })

    API.checkServer(server)
      .then(baseURL =>

        Settings
          .saveServer(baseURL)
          .then(() => Settings.synchronize(baseURL))
          .then(() => this.props.setBaseURL(baseURL))
          .then(() => this.setState({ serverError: false }))
          .then(() => this.props.setLoading(false))
          .then(() => this.props.navigation.navigate({
            routeName: 'CheckoutHome',
            key: 'CheckoutHome',
            params: { baseURL }
          }))

      )
      .catch((err) => {

        setTimeout(() => {

          const message = err.message ? err.message : this.props.t('TRY_LATER')

          this.input._root.clear()
          this.input._root.focus()

          this.props.setLoading(false)
          this.setState({ serverError: true, errorMessage: message })

        }, 500)

      })
  }

  render() {

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
          <Form>
            <Item last { ...itemProps }>
              <Input
                ref={(ref) => { this.input = ref }}
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholder={`${this.props.t('EXAMPLE')} : demo.coopcycle.org`}
                onChangeText={(text) => this.setState({ text })}
                returnKeyType="done"
                onSubmitEditing={ () => this.handleForm() } />
              { this.state.serverError && <Icon name="close-circle" /> }
            </Item>
            { this.state.serverError && (
            <View style={{ paddingLeft: 15 }}>
              <Text style={{ marginVertical: 5, color: '#ed2f2f' }}>{ this.state.errorMessage }</Text>
            </View>
            ) }
            <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
              <Button block onPress={ this.handleForm }>
                <Text>{this.props.t('SUBMIT')}</Text>
              </Button>
            </View>
          </Form>
        </Content>
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
    setLoading: loading => dispatch(setLoading(loading)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(ConfigureServer))
