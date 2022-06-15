import React, { Component } from 'react'
import { ActivityIndicator, InteractionManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Button, Icon, Text } from 'native-base'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Server from '../Server'
import AppUser from '../AppUser'
import { bootstrap, closeModal, resetModal, resetServer, setServers } from '../redux/App/actions'

import HomeNavigator from './navigators/HomeNavigator'
import DrawerNavigator from './navigators/DrawerNavigator'
import Modal from 'react-native-modal';
import CustomOnboarding from './home/CustomOnboarding';
import Config from 'react-native-config';

class Loading extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      error: false,
    }
  }

  async load() {

    try {
      const user = await AppUser.load()

      if (this.props.customBuild) {
        this.setState({ ready: true })
        await this.props.bootstrap(Config.DEFAULT_SERVER, user, false);
      } else {
        await this.loadServers(user);
      }
    } catch (e) {
      this.setState({ error: true })
    }
  }

  async loadServers(user) {
    const servers = await Server.loadAll()

    this.props.setServers(servers)

    if (this.props.baseURL) {

        await this.props.bootstrap(this.props.baseURL, user, true)

        this.setState({ ready: true })

    } else {
      this.setState({ ready: true })
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.load()
    })
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
    const close = () => this.props.modal.skippable && this.props.closeModal()
    const swipeDirection = this.props.modal.skippable ? [ 'down', 'up', 'left', 'right' ] : []

    return <>{this.bodyRender()}
      <Modal isVisible={this.props.modal.show} onSwipeComplete={close} swipeDirection={swipeDirection} onBackdropPress={close}>
        <View style={{ ...styles.content, ...styles[`${this.props.modal.type}Modal`] }}>
          <Text style={styles[`${this.props.modal.type}Modal`]}>{this.props.modal.content}</Text>
        </View>
      </Modal>
    </>
  }

  bodyRender() {

    if (this.state.error) {
      return this.renderError()
    }

    if (this.props.customBuild && this.props.firstRun) {
      return <CustomOnboarding/>
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
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
  },
  defaultModal: {},
  successModal: {
    color: '#0f5132',
    backgroundColor: '#d1e7dd',
    borderColor: '#badbcc',
  },
  warningModal: {
    color: '#664d03',
    backgroundColor: '#fff3cd',
    borderColor: '#ffecb5',
  },
  errorModal: {
    color: '#842029',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c2c7',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
})

function mapStateToProps(state) {

  return {
    loading: state.app.loading,
    baseURL: state.app.baseURL,
    httpClient: state.app.httpClient,
    modal: state.app.modal,
    customBuild: state.app.customBuild,
    firstRun: state.app.firstRun,
    addresses: state.account.addresses,
    address: state.checkout.address,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    bootstrap: (baseURL, user, loader = true) => dispatch(bootstrap(baseURL, user, loader)),
    setServers: servers => dispatch(setServers(servers)),
    resetServer: () => dispatch(resetServer()),
    closeModal: () => dispatch(closeModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Loading))
