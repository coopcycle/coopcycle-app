import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native'

import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Button, Text, Icon, List, ListItem, Thumbnail,
  Form, Item, Input, Label,
  Card, CardItem,
  Root, Toast, StyleProvider
} from 'native-base'
import getTheme from './native-base-theme/components'
import material from './native-base-theme/variables/material'

import { NavigationActions, StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import { translate, I18nextProvider } from 'react-i18next'

import API from './src/API'
import { Settings } from './src/Settings'
import { Registry } from './src/Registry'
import i18n from './src/i18n'
import { primaryColor,  whiteColor, fontTitleName } from './src/styles/common'
import { selectTriggerTasksNotification, dontTriggerTasksNotification } from './src/redux/Courier'
import { init as wsInit } from './src/redux/middlewares/WebSocketMiddleware'
import store, { observeStore } from "./src/redux/store"

const Routes = require('./src/page')
const AppUser = require('./src/AppUser')


let Router

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: primaryColor,
  },
  headerBackTitleStyle: {
    color: whiteColor,
    fontWeight: 'normal',
    fontFamily: fontTitleName
  },
  headerTintColor: whiteColor,
  headerTitleStyle: {
    color: whiteColor,
    // fontWeight needs to be defined or it doesn't work
    // @see https://github.com/react-community/react-navigation/issues/542#issuecomment-345289122
    fontWeight: 'normal',
    fontFamily: fontTitleName
  }
}

const courierHeaderLeft = navigation => {

  const { baseURL, client, user } = navigation.state.params
  const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({
        routeName: 'Home',
        params: {
          baseURL,
          client,
          user
        }
      })
    ]
  })

  return (
    <Button transparent onPress={ () => navigation.dispatch(resetAction) }>
      <Icon name="home" style={{ color: '#fff' }} />
    </Button>
  )
}

const routeConfigs = {
  Home: {
    screen: Routes.HomePage,
    navigationOptions: ({ navigation }) => {

      const { navigate } = navigation
      const { baseURL, client, user } = navigation.state.params

      if (user && user.isAuthenticated() && (user.hasRole('ROLE_COURIER') || user.hasRole('ROLE_ADMIN'))) {
        headerRight = (
          <Button transparent onPress={ () => navigate('Courier', { baseURL, client, user, connected: false, tracking: false }) }>
            <Icon name="ios-bicycle" style={{ color: '#fff' }} />
          </Button>
        )
      } else {
        headerRight = (
          <Button transparent />
        )
      }

      return {
        title: 'CoopCycle',
        headerRight
      }
    }
  },
  AccountAddresses: {
    screen: Routes.AccountAddressesPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ADDRESSES'),
    })
  },
  AccountOrders: {
    screen: Routes.AccountOrdersPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_ORDERS'),
    })
  },
  AccountDetails: {
    screen: Routes.AccountDetailsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('MY_DETAILS'),
    })
  },
  Courier: {
    screen: Routes.CourierPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('COURIER'),
      headerLeft: courierHeaderLeft(navigation)
    })
  },
  CourierTasks: {
    screen: Routes.CourierTasksPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASKS'),
    })
  },
  CourierTaskList: {
    screen: Routes.CourierTaskListPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('TASK_LIST'),
    })
  },
  CourierTask: {
    screen: Routes.CourierTaskPage,
    navigationOptions: ({ navigation }) => ({
      title: `${i18n.t('TASK')} #${navigation.state.params.task.id}`,
    })
  },
  CourierTaskHistory: {
    screen: Routes.CourierTaskHistoryPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('HISTORY'),
    })
  },
  CourierSettings: {
    screen: Routes.CourierSettingsPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('SETTINGS'),
    })
  },
  Dispatch: {
    screen: Routes.DispatchPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DISPATCH'),
    })
  },
  Restaurant: {
    screen: Routes.RestaurantPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('RESTAURANT'),
    })
  },
  Cart: {
    screen: Routes.CartPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('CART'),
    })
  },
  CartAddress: {
    screen: Routes.CartAddressPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('DELIVERY_ADDR'),
    })
  },
  CreditCard: {
    screen: Routes.CreditCardPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('PAYMENT'),
    })
  },
  OrderTracking: {
    screen: Routes.OrderTrackingPage,
    navigationOptions: ({ navigation }) => ({
      title: i18n.t('ORDER_TRACKING'),
    })
  },
}

const initialRouteName = user => {
  if (user && user.isAuthenticated() && user.hasRole('ROLE_COURIER')) {
    return 'Courier'
  }

  return 'Home'
}

class App extends Component {

  input = null
  reduxStoreUnsubscribe = () => {}

  constructor(props) {
    super(props)
    this.state = {
      client: null,
      initialized: false,
      loading: false,
      settings: {},
      server: null,
      text: '',
      user: null,
      serverError: false,
    }

    this.reduxStoreUnsubscribe = observeStore(
      store,
      selectTriggerTasksNotification,
      (triggerTasksNotification) => {
        if (triggerTasksNotification) {
          Toast.show({
            text: this.props.t('TASKS_UPDATED'),
            position: 'bottom'
          })
          store.dispatch(dontTriggerTasksNotification())
        }
      }
    )

    this.disconnect = this.disconnect.bind(this)
    this.connect = this.connect.bind(this)
    this.renderLoading = this.renderLoading.bind(this)
  }

  componentWillMount() {
    Settings.addListener('server:remove', this.disconnect)
    Settings.addListener('user:login', (event) => {
      const { client, user } = event
      if (user && user.isAuthenticated() && (user.hasRole('ROLE_COURIER') || user.hasRole('ROLE_ADMIN'))) {
        Registry.initWebSocketClient(client)
          .then(() => store.dispatch(wsInit(Registry.getWebSocketClient())))
          .catch(console.error)
      }
    })
    Settings.addListener('user:logout', () => Registry.clearWebSocketClient())

    AppUser.load()
      .then(user => {
        Settings
          .loadServer()
          .then(baseURL => this.initializeRouter(baseURL, user))
      })
  }

  componentWillUnmount() {
    this.reduxStoreUnsubscribe()
  }

  initializeRouter(baseURL, user) {
    let client = null

    if (baseURL) {
      client = API.createClient(baseURL, user)
      if (user && user.isAuthenticated() && (user.hasRole('ROLE_COURIER') || user.hasRole('ROLE_ADMIN'))) {
        Registry.initWebSocketClient(client)
          .then(() => store.dispatch(wsInit(Registry.getWebSocketClient())))
          .catch(console.error)
      }
    }

    const navigatorConfig = {
      initialRouteParams: {
        baseURL,
        client,
        user,
      },
      initialRouteName: initialRouteName(user),
      navigationOptions: {
        ...defaultNavigationOptions
      }
    }

    Router = StackNavigator(routeConfigs, navigatorConfig)

    this.setState({
      client: client,
      initialized: true,
      server: baseURL,
      user: user
    })
  }

  connect() {
    const server = this.state.text.trim()

    this.setState({ loading: true, serverError: false })

    API.checkServer(server)
      .then(baseURL => {
        const user = this.state.user
        Settings
          .saveServer(baseURL)
          .then(() => this.initializeRouter(baseURL, user))
      })
      .catch((err) => {

        setTimeout(() => {

          let message = this.props.t('TRY_LATER')
          let serverError = false
          if (err.message) {
            if (err.message === 'Network request failed') {
              message = this.props.t('NET_FAILED')
            }
            if (err.message === 'Not a CoopCycle server') {
              message = this.props.t('SERVER_INCOMPATIBLE')
              serverError = true
            }
            if (err.message === 'Hostname is not valid') {
              message = this.props.t('SERVER_INVALID')
              serverError = true
            }
          }

          Toast.show({
            text: message,
            position: 'bottom',
            type: 'danger',
            duration: 3000
          })

          this.input._root.clear()
          this.input._root.focus()

          this.setState({ loading: false, serverError })

        }, 500)

      })
  }

  disconnect() {
    const user = this.state.user
    user.logout()

    this.setState({
      client: null,
      server: null,
      user: user,
    })
  }

  renderLoading() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>{this.props.t('LOADING')}</Text>
      </View>
    )
  }

  renderConfigureServer() {

    let loader = (
      <View />
    )
    if (this.state.loading) {
      loader = (
        <View style={styles.loader}>
          <ActivityIndicator
            animating={true}
            size="large"
            color="#fff"
          />
          <Text style={{color: '#fff'}}>{`${this.props.t('LOADING')}...`}</Text>
        </View>
      )
    }

    const itemProps = this.state.serverError ? { error: true } : {}

    return (
      <Root>
        <StyleProvider style={getTheme(material)}>
          <Container>
            <Header>
              <Left />
              <Body>
              <Title>CoopCycle</Title>
              </Body>
              <Right />
            </Header>
            <Content>
              <View style={{ marginHorizontal: 10, marginTop: 20 }}>
                <Card>
                  <CardItem>
                    <Body>
                    <Text>
                      {`${this.props.t('CHOOSE_SERVER')}.`}
                    </Text>
                    </Body>
                  </CardItem>
                </Card>
              </View>
              <Form style={{ marginVertical: 30 }}>
                <Item stackedLabel last { ...itemProps }>
                  <Label>{this.props.t('SERVER_URL')}</Label>
                  <Input
                    ref={(ref) => { this.input = ref }}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    placeholder={`${this.props.t('EXAMPLE')} : demo.coopcycle.org`}
                    onChangeText={(text) => this.setState({ text })} />
                </Item>
              </Form>
              <View style={{ paddingHorizontal: 10 }}>
                <Button block onPress={ this.connect }>
                  <Text>{this.props.t('SUBMIT')}</Text>
                </Button>
              </View>
            </Content>
            { loader }
          </Container>
        </StyleProvider>
      </Root>
    )
  }

  render() {

    if (!this.state.initialized) {
      return this.renderLoading()
    }

    if (!this.state.server) {
      return this.renderConfigureServer()
    }

    return (
      <Root>
        <Provider store={store}>
          <I18nextProvider i18n={i18n}>
            <StyleProvider style={getTheme(material)}>
              <Router />
            </StyleProvider>
          </I18nextProvider>
        </Provider>
      </Root>
    )
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
})

export default translate()(App)
