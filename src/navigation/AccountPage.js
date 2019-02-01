import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Header, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Button
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

import AuthenticateForm from '../components/AuthenticateForm'
import Settings from '../Settings'
import { logout } from '../redux/App/actions'

class AccountPage extends Component {

  async resetServer() {

    const { navigate } = this.props.navigation

    await this.props.user.logout()
    await Settings.removeServer()

    navigate('ConfigureServer')
  }

  renderServer() {
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={{ textAlign: 'center' }}>
          {
            [
              this.props.t('CONNECTED_TO'),
              ' ',
              <Text key={3} style={{ fontWeight: 'bold' }}>{ this.props.baseURL }</Text>
            ]
          }
        </Text>
        <Button block transparent onPress={ this.resetServer.bind(this) }>
          <Text>{this.props.t('CHANGE_SERVER')}</Text>
        </Button>
      </View>
    )
  }

  renderAuthenticated() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <Content padder>
          { this.renderServer() }
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
            <Icon name="person" />
            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
              {`${this.props.t('HELLO')} ${ this.props.user.username }`}
            </Text>
          </View>
          <List>
            <ListItem button iconRight onPress={ () => navigate('AccountDetails') }>
              <Body>
                <Text>{this.props.t('DETAILS')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountAddresses') }>
              <Body>
                <Text>{this.props.t('ADDRESSES')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem button iconRight onPress={ () => navigate('AccountOrders') }>
              <Body>
                <Text>{this.props.t('ORDERS')}</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <View style={{ marginTop: 40, marginBottom: 60 }}>
            <Button block danger onPress={ () => this.props.logout() }>
              <Text>{this.props.t('SIGN_OUT')}</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }

  renderMessage() {
    if (this.props.message) {
      return (
        <View style={styles.message}>
          <Text style={{ textAlign: 'center' }}>{this.props.message}</Text>
        </View>
      )
    }
  }

  render() {

    if (this.props.isAuthenticated) {

      return this.renderAuthenticated()
    }

    return (
      <Container>
        <Content padder>
          { this.renderServer() }
          { this.renderMessage() }
          <AuthenticateForm navigateAfterLogin={ true } />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
})

function mapStateToProps(state) {

  return {
    baseURL: state.app.baseURL,
    user: state.app.user,
    message: state.app.lastAuthenticationError,
    isAuthenticated: state.app.isAuthenticated,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    logout: () => dispatch(logout()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(AccountPage))
