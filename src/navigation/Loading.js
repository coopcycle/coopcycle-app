import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Button, Icon, Text } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Server from '../Server'
import AppUser from '../AppUser'
import { bootstrap, resetServer, setServers } from '../redux/App/actions'

import HomeNavigator from './navigators/HomeNavigator'
import DrawerNavigator from './navigators/DrawerNavigator'

class Loading extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      error: false,
    }
  }

  async load() {

    const servers = await Server.loadAll()

    this.props.setServers(servers)

    if (this.props.baseURL) {

      try {

        const user = await AppUser.load()

        await this.props.bootstrap(this.props.baseURL, user)

        this.setState({ ready: true })

      } catch (e) {
        this.setState({ error: true })
      }

    } else {
      this.setState({ ready: true })
    }
  }

  componentDidMount() {
    this.load()
  }

  renderError() {
    return (
      <View style={ styles.error }>
        <Icon as={Ionicons} name="warning" />
        <Text style={ styles.errorText }>
          { this.props.t('NET_FAILED') }
        </Text>
        <Button block onPress={ () => this.load() }>
          <Text>{ this.props.t('RETRY') }</Text>
        </Button>
        <View style={{ marginVertical: 20 }}>
          <TouchableOpacity style={{ paddingVertical: 15 }} onPress={ () => this.props.resetServer() }>
            <Text>{ this.props.t('CHANGE_SERVER') }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {

    if (this.state.error) {
      return this.renderError()
    }

    if (this.state.ready) {
      // We need to check if httpClient is defined, because it is managed by a middleware.
      // So, when dispatching a Redux action that triggers the middleware,
      // the screens may re-render *BEFORE* httpClient has been defined.
      if (this.props.baseURL && this.props.httpClient) {
        return <DrawerNavigator />
      } else {
        return <HomeNavigator />
      }
    }

    return (
      <View style={ styles.loader }>
        <ActivityIndicator size="large" color="#c7c7c7" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginBottom: 10,
  },
})

function mapStateToProps(state) {

  return {
    loading: state.app.loading,
    baseURL: state.app.baseURL,
    httpClient: state.app.httpClient,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    bootstrap: (baseURL, user) => dispatch(bootstrap(baseURL, user)),
    setServers: servers => dispatch(setServers(servers)),
    resetServer: () => dispatch(resetServer()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Loading))
