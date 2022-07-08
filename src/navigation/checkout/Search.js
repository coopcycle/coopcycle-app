import React, {Component} from 'react';
import {Dimensions, InteractionManager, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context'
import {Text} from 'native-base';
import {connect} from 'react-redux'
import {withTranslation} from 'react-i18next'

import RestaurantSearch from '../../components/RestaurantSearch'
import RestaurantList from '../../components/RestaurantList'
import {
  loadRestaurantsSuccess,
  resetSearch,
  searchRestaurants,
  searchRestaurantsForAddress,
  setRestaurant,
} from '../../redux/Checkout/actions'
import {selectServer} from '../../redux/App/actions'
import {selectRestaurants} from '../../redux/Checkout/selectors'
import {selectServersInSameCity} from '../../redux/App/selectors'
import {SceneMap, TabBar, TabView} from 'react-native-tab-view'
import MultipleServersInSameCityModal from './components/MultipleServersInSameCityModal';
import Address from '../../utils/Address'

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
    const firstServer = this.props.otherServers[0]
    const { address } = this.props

    if (firstServer && firstServer.coopcycle_url !== this.props.baseURL) {
      // the servers are randomly ordered to avoid same server as the first option
      // so we select the new first server if it is different to the selected in a previous usage of the app
      return this._renderRestaurantsForTab({index: 0, url: firstServer.coopcycle_url})
    }
    if (address) {
      this.props.searchRestaurantsForAddress(address, { baseURL: this.state.baseURL })
    } else {
      this.props.searchRestaurants({ baseURL: this.state.baseURL })
    }
  }

  shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
    return Address.geoDiff(this.props.address, nextProps.address)
  }

  componentDidUpdate(prevProps, prevState) {

    const prevAddress = prevProps.route.params?.address
    const addressAsParam = this.props.route.params?.address

    if (addressAsParam && prevAddress !== addressAsParam) {
      InteractionManager.runAfterInteractions(() => this._onAddressSelect(addressAsParam))
    }

    if (this.state.baseURL !== prevState.baseURL) {
      const { address } = this.props
      if (address) {
        this.props.searchRestaurantsForAddress(address, { baseURL: this.state.baseURL })
      } else {
        this.props.searchRestaurants({ baseURL: this.state.baseURL })
      }
    }
  }

  _onRestaurantSelectedInTab(restaurant) {
    this.props.selectServer(this.state.baseURL)
      .then(() => {
        this.props.navigation.navigate('CheckoutRestaurant', { restaurant })
      })
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
            onItemClick={ restaurant => this._onRestaurantSelectedInTab(restaurant) }
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

  _renderRestaurantsForTab({index, url}) {
    this.props.loadRestaurantsSuccess([])
    this.setState({
      baseURL: url,
      index,
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
          onIndexChange={(index) => this._renderRestaurantsForTab({index, url: routes[index].key})}
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
            onItemClick={ restaurant => {
              this.props.setRestaurant(restaurant['@id'])
              this.props.navigation.navigate('CheckoutRestaurant', { restaurant })
            } } />
        </SafeAreaView>
      )
    }

  }

  render() {

    const {navigate} = this.props.navigation
    return <>

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
            this.props.resetSearch({ baseURL: this.state.baseURL })
          } }
          defaultValue={ this.props.address }
          width={ this.state.width }
          key={ this.props.addressAsText }
          savedAddresses={ this.props.savedAddresses }
        />

        <MultipleServersInSameCityModal
          multipleServers={this.props.otherServers.length > 1} />
      </View>
    </>;
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
    searchRestaurants: (options) => dispatch(searchRestaurants(options)),
    searchRestaurantsForAddress: (address, options) => dispatch(searchRestaurantsForAddress(address, options)),
    setRestaurant: id => dispatch(setRestaurant(id)),
    resetSearch: (options) => dispatch(resetSearch(options)),
    loadRestaurantsSuccess: (restaurants) => dispatch(loadRestaurantsSuccess(restaurants)),
    selectServer: (serverURL) => dispatch(selectServer(serverURL)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(RestaurantsPage))
