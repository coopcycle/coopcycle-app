import React, { Component } from 'react'
import { InteractionManager, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Text } from 'native-base'

import Servers from '../Server'
import AppUser from '../AppUser'
import { bootstrap, closeModal, setServers } from '../redux/App/actions'

import HomeNavigator from './navigators/HomeNavigator'
import DrawerNavigator from './navigators/DrawerNavigator'
import Modal from 'react-native-modal';
import Config from 'react-native-config';
import Server from './account/components/Server'
import { selectIsSpinnerDelayEnabled } from '../redux/App/selectors'

import * as Sentry from '@sentry/react-native';

import FullScreenLoadingIndicator from './FullScreenLoadingIndicator'
import { selectCustomBuild } from '../redux/App/selectors'
import LoadingError from './LoadingError'

class Loading extends Component {

  constructor(props) {
    super(props)
    this.state = {
      ready: false,
      error: false,
      modal: props.modal,
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
    const servers = await Servers.loadAll()

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.modal !== this.props.modal) {
      if (this.props.isSpinnerDelayEnabled) {
        if (!prevProps.modal.show && this.props.modal.show) {
          // add an extra delay to make sure that the modal is shown after the Spinner is hidden:
          // https://github.com/coopcycle/coopcycle-app/blob/master/src/components/Spinner.js#L22
          setTimeout(() => this.setState({ modal: this.props.modal }), 500)
        } else {
          this.setState({ modal: this.props.modal })
        }
      } else {
        // added to track the number of the beta version users who have the delay disabled, could be removed later
        Sentry.captureMessage('Spinner delay is not applied')
        this.setState({ modal: this.props.modal })
      }
    }
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
          { this.props.customBuild ? null : <Server /> }
        </View>
      </View>
    )
  }

  render() {
    const close = () => this.state.modal.skippable && this.props.closeModal()
    const swipeDirection = this.state.modal.skippable ? [ 'down', 'up', 'left', 'right' ] : []

    return <>{this.bodyRender()}
      <Modal isVisible={this.state.modal.show} onSwipeComplete={close} swipeDirection={swipeDirection} onBackdropPress={close}>
        <View style={{ ...styles.content, ...styles[`${this.state.modal.type}Modal`] }}>
          <Text style={styles[`${this.state.modal.type}Modal`]}>{this.state.modal.content}</Text>
        </View>
      </Modal>
    </>
  }

  bodyRender() {

    if (this.state.error) {
      return <LoadingError />
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
      <FullScreenLoadingIndicator debugHint="Connecting to the server ..." />
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
  },
  defaultModal: {
    color: 'black',
  },
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
    customBuild: selectCustomBuild(state),
    firstRun: state.app.firstRun,
    isSpinnerDelayEnabled: selectIsSpinnerDelayEnabled(state)
  }
}

function mapDispatchToProps(dispatch) {

  return {
    bootstrap: (baseURL, user, loader = true) => dispatch(bootstrap(baseURL, user, loader)),
    setServers: servers => dispatch(setServers(servers)),
    closeModal: () => dispatch(closeModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Loading))
