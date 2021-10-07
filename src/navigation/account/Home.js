import React, { Component } from 'react'
import { FlatList, TouchableOpacity, View } from 'react-native'
import {
  Container, Content,
  Icon, Text, Button,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import Server from './components/Server'
import { logout } from '../../redux/App/actions'
import { selectIsAuthenticated } from '../../redux/App/selectors'
import ItemSeparator from '../../components/ItemSeparator'
import LoginRegister from './LoginRegister'

class AccountHome extends Component {

  render() {

    if (!this.props.isAuthenticated) {
      return (
        <LoginRegister navigation={ this.props.navigation } />
      )
    }

    const { navigate } = this.props.navigation

    const data = [
      {
        label: this.props.t('DETAILS'),
        onPress: () => navigate('AccountDetails')
      },
      {
        label: this.props.t('ADDRESSES'),
        onPress: () => navigate('AccountAddresses')
      },
      {
        label: this.props.t('ORDERS'),
        onPress: () => navigate('AccountOrders', { screen: 'AccountOrdersList' })
      },
    ]

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
          <FlatList
            data={ data }
            keyExtractor={ (item, index) => `account-${index}` }
            ItemSeparatorComponent={ ItemSeparator }
            renderItem={({ item }) => (
              <TouchableOpacity onPress={ item.onPress }>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                  <Text>
                    { item.label }
                  </Text>
                  <Icon name="arrow-forward" />
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={{ marginTop: 40, marginBottom: 60 }}>
            <Button block danger onPress={ () => this.props.logout() } testID="logout">
              <Text>{this.props.t('SIGN_OUT')}</Text>
            </Button>
          </View>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {

  return {
    user: state.app.user,
    message: state.app.lastAuthenticationError,
    isAuthenticated: selectIsAuthenticated(state),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    logout: () => dispatch(logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountHome))
