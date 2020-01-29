import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Button, Icon, Text } from 'native-base'

import Settings from '../Settings'
import Server from '../Server'
import AppUser from '../AppUser'
import { bootstrap, resetServer, setServers } from '../redux/App/actions'

class Loading extends Component {

  constructor(props) {
    super(props)
    this.state = {
      error: false,
    }
  }

  async load() {

    const servers = await Server.loadAll()

    this.props.setServers(servers)

    if (this.props.baseURL) {

      try {

        const user = await AppUser.load()

        await Settings.synchronize(this.props.baseURL)

        this.props.bootstrap(this.props.baseURL, user)

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
        <View style={{ marginVertical: 20 }}>
          <TouchableOpacity style={{ paddingVertical: 15 }} onPress={ () => this.props.resetServer() }>
            <Text>{ this.props.t('CHANGE_SERVER') }</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={ styles.loader }>
        { (!this.state.error && !this.props.loading) && <ActivityIndicator animating={ true } size="large" /> }
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
  }
}

function mapDispatchToProps(dispatch) {

  return {
    bootstrap: (baseURL, user) => dispatch(bootstrap(baseURL, user)),
    setServers: servers => dispatch(setServers(servers)),
    resetServer: () => dispatch(resetServer()),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Loading))
