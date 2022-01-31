import React, { Component } from 'react';
import {
  InteractionManager,
  View,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import RestaurantSearch from '../../components/RestaurantSearch'
import RestaurantList from '../../components/RestaurantList'
import { searchRestaurants, searchRestaurantsForAddress, resetSearch, loadRestaurantsSuccess } from '../../redux/Checkout/actions'
import { selectServer } from '../../redux/App/actions'
import { selectRestaurants } from '../../redux/Checkout/selectors'
import { selectServersInSameCity } from '../../redux/App/selectors'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

class RestaurantsPage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      width: Dimensions.get('window').width,
      searchText: '',
      baseURL: props.baseURL,
      index: 0,
    }
  }

  _onAddressSelect(address) {
    if (address) {
      this.props.searchRestaurantsForAddress(address)
    }
  }

  componentDidMount() {
    this.props.searchRestaurants()
  }

  componentDidUpdate(prevProps, prevState) {

    const prevAddress = prevProps.route.params?.address
    const addressAsParam = this.props.route.params?.address

    if (addressAsParam && prevAddress !== addressAsParam) {
      InteractionManager.runAfterInteractions(() => this._onAddressSelect(addressAsParam))
    }

    if (this.state.baseURL !== prevState.baseURL) {
      this.props.selectServer(this.state.baseURL)
        .then(() => {
          const { address } = this.props
          if (address) {
            this.props.searchRestaurantsForAddress(address)
          } else {
            this.props.searchRestaurants()
          }
        })
    }
  }

  _mapServersForTabs() {
    const { restaurants, addressAsText, isFetching } = this.props

    return this.props.otherServers.map((otherServer) => {
      return {
        key: otherServer.coopcycle_url,
        title: otherServer.name,
        list: () => (
          <RestaurantList
            restaurants={ this.props.isFetching ? [] : restaurants }
            addressAsText={addressAsText}
            isFetching={isFetching}
            onItemClick={ restaurant => this.props.navigation.navigate('CheckoutRestaurant', { restaurant }) }
          />
        ),
      }
    })
  }

  _loadTabsRoutesAndScenes() {
    const serversMapped = this._mapServersForTabs()

    const routes = serversMapped.map(({key, title}) => {
      return {key, title}
    })

    let scenes = {}

    serversMapped.forEach(({key, list}) => {
      scenes = {
        [key]: list,
        ...scenes,
      }
    })

    const sceneMap = SceneMap(scenes)

    return { routes, sceneMap }
  }

  _renderServersTabs(props) {
    return (
      <TabBar
        {...props}
        scrollEnabled={true}
        renderLabel={({ route, focused, color }) => (
          <Text numberOfLines={2} style={{ textAlign: 'center', color, margin: 4 }} fontWeight={ focused ? 'bold' : 'normal' }>
            {route.title}
          </Text>
        )}
        indicatorStyle={{ backgroundColor: 'red' }}
        style={{ backgroundColor: 'white'  }}
        labelStyle={{ color: 'black' }} />
    )
  }

  _renderRestaurantsForTab(routes, serverIndex) {
    this.props.loadRestaurantsSuccess([])
    this.setState({
      baseURL: routes[serverIndex].key,
      index: serverIndex,
    })
  }

  renderContent() {
    const { restaurants, addressAsText, isFetching, otherServers } = this.props

    if (otherServers.length > 1) {
      const { routes, sceneMap } = this._loadTabsRoutesAndScenes();
      return (
        <TabView
          renderTabBar={this._renderServersTabs}
          navigationState={{ index: this.state.index, routes }}
          renderScene={sceneMap}
          onIndexChange={(index) => this._renderRestaurantsForTab(routes, index)}
          initialLayout={{ width: this.state.width }}
          lazy
        />
      )
    } else {
      return (
        <SafeAreaView edges={ [ 'right', 'bottom', 'left' ] } style={{flexGrow: 1}}>
          <RestaurantList
            restaurants={ restaurants }
            addressAsText={addressAsText}
            isFetching={isFetching}
            onItemClick={ restaurant => this.props.navigation.navigate('CheckoutRestaurant', { restaurant }) } />
        </SafeAreaView>
      )
    }

  }

  render() {

    return (
      <View style={{ flex: 1, paddingTop: 54 }} testID="checkoutSearch"
        onLayout={ event => this.setState({ width: event.nativeEvent.layout.width }) }
        >
        { this.renderContent() }
        { /* This component needs to be rendered *ABOVE* the list */ }
        { /* This is why it should be the last child component */ }
        { /* Use a "key" prop to make sure component renders */ }
        <RestaurantSearch
          country={ this.props.country }
          onSelect={ address => this._onAddressSelect(address) }
          onReset={ () => {
            this.props.resetSearch()
          } }
          defaultValue={ this.props.address }
          width={ this.state.width }
          key={ this.props.addressAsText }
          savedAddresses={ this.props.savedAddresses } />
      </View>
    );
  }
}

function mapStateToProps(state, ownProps) {

  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    restaurants: selectRestaurants(state),
    address: state.checkout.address,
    addressAsText: state.checkout.address ? state.checkout.address.streetAddress : '',
    savedAddresses: state.account.addresses.slice(0, 3),
    baseURL: state.app.baseURL,
    otherServers: selectServersInSameCity(state),
    isFetching: state.checkout.isFetching || state.app.loading,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    searchRestaurants: () => dispatch(searchRestaurants()),
    searchRestaurantsForAddress: address => dispatch(searchRestaurantsForAddress(address)),
    resetSearch: () => dispatch(resetSearch()),
    loadRestaurantsSuccess: (restaurants) => dispatch(loadRestaurantsSuccess(restaurants)),
    selectServer: (serverURL) => dispatch(selectServer(serverURL)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RestaurantsPage))
