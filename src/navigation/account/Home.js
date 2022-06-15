import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import {
  Icon, Text, Button, FlatList, Box, HStack,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Ionicons from 'react-native-vector-icons/Ionicons'

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
      <View style={{ flex: 1 }}>
        { this.props.customBuild ? null : <Server /> }
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
          <Icon as={Ionicons} name="person" />
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
              <Box
                px="3"
                py="3"
              >
                <HStack space={3} justifyContent="space-between">
                  <Text>
                    { item.label }
                  </Text>
                  <Icon as={ Ionicons } name="arrow-forward" />
                </HStack>
              </Box>
            </TouchableOpacity>
          )}
        />
        <Box p="2">
          <Button colorScheme="secondary" onPress={ () => this.props.logout() } testID="logout">
            {this.props.t('SIGN_OUT')}
          </Button>
        </Box>
      </View>
    )
  }
}

function mapStateToProps(state) {

  return {
    user: state.app.user,
    message: state.app.lastAuthenticationError,
    isAuthenticated: selectIsAuthenticated(state),
    customBuild: state.app.customBuild,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    logout: () => dispatch(logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountHome))
