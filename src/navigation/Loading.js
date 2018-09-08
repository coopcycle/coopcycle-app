import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import _ from 'lodash'

import Settings from '../Settings'
import API from '../API'
import AppUser from '../AppUser'
import { bootstrap } from '../redux/App/actions'
import { loadMyRestaurants } from '../redux/Restaurant/actions'

class Loading extends Component {

  constructor(props) {
    super(props)
  }

  navigateToHome(httpClient, user) {
    if (user && user.isAuthenticated()) {
      if (user.hasRole('ROLE_COURIER')) {
        return this.props.navigation.navigate('Courier')
      } else if (user.hasRole('ROLE_RESTAURANT')) {
        this.props.loadMyRestaurants(httpClient)
      } else {
        this.props.navigation.navigate({
          routeName: 'Home',
          key: 'Home',
          params: {}
        })
      }
    } else {
      this.props.navigation.navigate({
        routeName: 'Home',
        key: 'Home',
        params: {}
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.restaurants !== this.props.restaurants) {
      this.props.navigation.navigate('RestaurantDashboard')
    }
  }

  async componentDidMount() {

    const baseURL = await Settings.loadServer()

    if (baseURL) {

      const user = await AppUser.load()

      try {
        const settings = await Settings.synchronize(baseURL)
      } catch (error) {
        return this.navigateToHome(httpClient);
      }

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

    } else {
      this.props.navigation.navigate('ConfigureServer')
    }
  }

  render() {
    return (
      <View style={ styles.loader }>
        <ActivityIndicator animating={ true } size="large" />
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
