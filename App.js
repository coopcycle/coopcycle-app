import React, { Component } from 'react'
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  ActivityIndicator
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

import moment from 'moment'
import { NavigationActions, StackNavigator } from 'react-navigation'
import { Provider } from 'react-redux'
import { translate, I18nextProvider } from 'react-i18next'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation'

import API from './src/API'
import { Settings } from './src/Settings'
import { Registry } from './src/Registry'
import i18n from './src/i18n'
import { primaryColor,  whiteColor, fontTitleName } from './src/styles/common'
import { loadTasks } from './src/redux/Courier'
import store from "./src/redux/store"
import PushNotification from "./src/notifications"

const Routes = require('./src/page')
const AppUser = require('./src/AppUser')

import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes.',
  'Module RCTImageLoader requires main queue setup',
  'Module RCTBackgroundGeolocation requires main queue setup'
]);


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

const getCurrentRoute = state => (
  state.index !== undefined ? getCurrentRoute(state.routes[state.index]) : state.routeName
);

class App extends Component {

  input = null
  navigator = null
  currentRouteName = 'Home'

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

    this.disconnect = this.disconnect.bind(this)
    this.connect = this.connect.bind(this)
    this.renderLoading = this.renderLoading.bind(this)
  }

  async componentDidMount() {

    Settings.addListener('server:remove', this.disconnect)

    const baseURL = await Settings.loadServer()

    if (baseURL) {

      const user = await AppUser.load()
      const settings = await Settings.synchronize(baseURL)

      if (!user.isAuthenticated()) {
        return this.initializeRouter(baseURL, user)
      }

      // Make sure the token is still valid
      // If not, logout user
      API.createClient(baseURL, user)
        .checkToken()
        .then(() => this.initializeRouter(baseURL, user))
        .catch(e => {
          user
            .logout()
            .then(() => this.initializeRouter(baseURL, user))
        })

    } else {
      // There is no server configured
      this.setState({ initialized: true })
    }

  }

  componentWillUnmount() {
    PushNotification.removeListeners()
  }

  initializeRouter(baseURL, user) {
    let client = null

    console.log('PushNotification initializeRouter')

    if (baseURL) {
      client = API.createClient(baseURL, user)
      if (user && user.isAuthenticated()) {

        BackgroundGeolocation.configure({
          desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
          stationaryRadius: 5,
          distanceFilter: 10,
          debug: false,
          startOnBoot: false,
          startForeground: false,
          stopOnTerminate: true,
          stopOnStillActivity: false,
          locationProvider: BackgroundGeolocation.RAW_PROVIDER,
          interval: 3000,
          fastestInterval: 1000,
          activitiesInterval: 5000,
          maxLocations: 10,
          url: client.getBaseURL() + '/api/me/location',
          syncUrl: client.getBaseURL() + '/api/me/location',
          syncThreshold: 10,
          httpHeaders: {
            'Authorization': `Bearer ${client.getToken()}`,
            'Content-Type': "application/ld+json",
          },
          postTemplate: {
            latitude: '@latitude',
            longitude: '@longitude',
            time: '@time',
          }
        })

        const onTasksChanged = date => {
          if (this.currentRouteName !== 'CourierTaskList') {
            const pushAction = NavigationActions.push({
              routeName: 'CourierTaskList',
              params: {
                baseURL,
                client,
                user
              }
            })
            this.navigator.dispatch(pushAction)
          }
          store.dispatch(loadTasks(client, moment(date)))
        }

        PushNotification.configure({
          onRegister: token => {
            client
              .post('/api/me/remote_push_tokens', { platform: Platform.OS, token })
              .catch(e => console.log(e))
          },
          onNotification: notification => {
            const { event } = notification.data
            if (event && event.name === 'tasks:changed') {
              if (notification.foreground) {
                Alert.alert(
                  'Tâches mises à jour',
                  `Vos tâches du ${event.data.date} ont été mises à jour`,
                  [
                    {
                      text: 'Annuler',
                      onPress: () => {}
                    },
                    {
                      text: 'Afficher',
                      onPress: () => onTasksChanged(event.data.date)
                    },
                  ],
                  {
                    cancelable: true
                  }
                )
              } else {
                onTasksChanged(event.data.date)
              }
            }
          }
        })

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
      initialized: true,
      server: baseURL,
      client: client,
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
          .then(() => Settings.synchronize(baseURL))
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
    const { user } = this.state
    user.logout()
    this.setState({
      user,
      client: null,
      server: null,
    })
  }

  onNavigationStateChange(prevState, newState) {
    this.currentRouteName = getCurrentRoute(this.navigator.state.nav)
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
              <Router
                ref={ ref => { this.navigator = ref } }
                onNavigationStateChange={ this.onNavigationStateChange.bind(this) } />
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
