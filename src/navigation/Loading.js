import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import Settings from '../Settings'
import API from '../API'
import AppUser from '../AppUser'
import { bootstrap } from '../redux/App/actions'

class Loading extends Component {

  constructor(props) {
    super(props)
  }

  navigateToHome(user) {
    if (user && user.isAuthenticated() && user.hasRole('ROLE_COURIER')) {
      return this.props.navigation.navigate('Courier')
    }

    this.props.navigation.navigate({
      routeName: 'Home',
      key: 'Home',
      params: {}
    })
  }

  async componentDidMount() {

    const baseURL = await Settings.loadServer()

    if (baseURL) {

      const user = await AppUser.load()
      const settings = await Settings.synchronize(baseURL)

      this.props.bootstrap(baseURL, user)

      if (!user.isAuthenticated()) {
        return this.navigateToHome()
      }

      const httpClient = API.createClient(baseURL, user)

      // Make sure the token is still valid
      // If not, logout user
      httpClient.checkToken()
        .then(() => this.navigateToHome(user))
        .catch(e => {
          user
            .logout()
            .then(() => this.navigateToHome())
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
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    bootstrap: (baseURL, user) => dispatch(bootstrap(baseURL, user)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(Loading))
