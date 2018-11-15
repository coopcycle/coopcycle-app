import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'
import { Button, Icon, Text } from 'native-base'

import Settings from '../Settings'
import API from '../API'
import AppUser from '../AppUser'
import { bootstrap } from '../redux/App/actions'
import { loadMyRestaurants } from '../redux/Restaurant/actions'

class Loading extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: false
    }
  }

  navigateToHome(httpClient, user) {
    if (user && user.isAuthenticated()) {
      if (user.hasRole('ROLE_COURIER')) {
        return this.props.navigation.navigate('CourierHome')
      } else if (user.hasRole('ROLE_RESTAURANT')) {
        // We will call navigate() in componentDidUpdate, once restaurants are loaded
        this.props.loadMyRestaurants(httpClient)
      } else {
        this.props.navigation.navigate({
          routeName: 'CheckoutHome',
          key: 'CheckoutHome',
          params: {}
        })
      }
    } else {
      this.props.navigation.navigate({
        routeName: 'CheckoutHome',
        key: 'CheckoutHome',
        params: {}
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.restaurants !== this.props.restaurants) {
      if (this.props.restaurants.length > 0) {
        this.props.navigation.navigate('RestaurantHome')
      } else {
        this.props.navigation.navigate({
          routeName: 'CheckoutHome',
          key: 'CheckoutHome',
          params: {}
        })
      }
    }
  }

  async load() {

    this.setState({ error: false })

    const baseURL = await Settings.loadServer()

    if (baseURL) {

      try {

        const user = await AppUser.load()
        const settings = await Settings.synchronize(baseURL)

        this.props.bootstrap(baseURL, user)

        if (!user.isAuthenticated()) {
          return this.navigateToHome(httpClient)
        }

        const httpClient = API.createClient(baseURL, user)

        // Make sure the token is still valid
        // If not, logout user
        httpClient.checkToken()
          .then(() => this.navigateToHome(httpClient, user))
          .catch(e => {
            user
              .logout()
              .then(() => this.navigateToHome(httpClient))
          })

      } catch (e) {
        this.setState({ error: true })
      }

    } else {
      this.props.navigation.navigate('ConfigureServer')
    }
  }

  componentDidMount() {
    this.load()
  }

  renderError() {
    return (
      <View style={ styles.error }>
        <Icon name="warning" />
        <Text style={ styles.errorText }>
          { this.props.t('NET_FAILED') }
        </Text>
        <Button block onPress={ () => this.load() }>
          <Text>{ this.props.t('RETRY') }</Text>
        </Button>
      </View>
    )
  }

  render() {
    return (
      <View style={ styles.loader }>
        { !this.state.error && <ActivityIndicator animating={ true } size="large" /> }
        { this.state.error && this.renderError() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorText: {
    marginBottom: 10,
  }
})

function mapStateToProps(state) {
  return {
    restaurants: state.restaurant.myRestaurants,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    bootstrap: (baseURL, user) => dispatch(bootstrap(baseURL, user)),
    loadMyRestaurants: client => dispatch(loadMyRestaurants(client)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(Loading))
