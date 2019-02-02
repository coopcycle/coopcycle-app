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

import Server from './components/Server'
import { logout } from '../../redux/App/actions'

class AccountHome extends Component {

  componentDidUpdate() {
    if (!this.props.isAuthenticated) {
      this.props.navigation.navigate('AccountNotAuthenticated')
    }
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <Content padder>
          <Server />
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
}

const styles = StyleSheet.create({
})

function mapStateToProps(state) {

  return {
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(AccountHome))
