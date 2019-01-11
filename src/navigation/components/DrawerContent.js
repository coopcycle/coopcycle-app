import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { Text, Icon } from 'native-base'
import _ from 'lodash'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { DrawerItems, SafeAreaView, NavigationActions } from 'react-navigation'

class DrawerContent extends Component {

  render() {

    const { items, restaurants, user } = this.props

    const restaurantItems =
      _.filter(items, item => 'RestaurantNav' === item.routeName)
    const courierItems =
      _.filter(items, item => 'CourierNav' === item.routeName)
    const accountItems =
      _.filter(items, item => 'AccountNav' === item.routeName)
    const adminItems =
      _.filter(items, item => _.includes(['DispatchNav'], item.routeName))

    const otherItems = _.filter(items, item => {
      if (_.includes(restaurantItems, item)
        || _.includes(courierItems, item)
        || _.includes(accountItems, item)
        || _.includes(adminItems, item)) {
        return false
      }

      return true
    })

    const otherItemsProps = {
      ...this.props,
      items: otherItems
    }

    let restaurantSection = (
      <View />
    )
    let courierSection = (
      <View />
    )
    let adminSection = (
      <View />
    )

    const isAuthenticated = user && user.isAuthenticated()

    if (isAuthenticated) {

      if ((user.hasRole('ROLE_ADMIN') || user.hasRole('ROLE_RESTAURANT')) && restaurants.length > 0) {

        let restaurantItemsProps

        // When there is ONE restaurant, show a direct link
        if (restaurants.length === 1) {
          restaurantItemsProps = {
            ...this.props,
            items: restaurants.map(restaurant => ({
              ...restaurantItems[0],
              params: {
                restaurant
              }
            })),
            getLabel: ({ route }) => {
              const { restaurant } = route.params

              return restaurant.name
            }
          }
        } else {
          restaurantItemsProps = {
            ...this.props,
            items: restaurantItems,
            getLabel: ({ route }) => {
              return this.props.t('RESTAURANTS')
            }
          }
        }

        restaurantSection = (
          <View>
            <DrawerItems { ...restaurantItemsProps } />
          </View>
        )
      }

      if (user.hasRole('ROLE_COURIER')) {
        const courierItemsProps = {
          ...this.props,
          items: courierItems,
        }

        courierSection = (
          <View>
            <DrawerItems { ...courierItemsProps } />
          </View>
        )
      }

      if (user.hasRole('ROLE_ADMIN')) {
        const adminItemsProps = {
          ...this.props,
          items: adminItems,
        }

        adminSection = (
          <View>
            <DrawerItems { ...adminItemsProps } />
          </View>
        )
      }
    }

    const navigateToAccount = () =>
      this.props.navigation.dispatch(NavigationActions.navigate({ routeName: 'AccountNav' }))

    return (
      <ScrollView>
        <SafeAreaView style={ styles.container } forceInset={{ top: 'always', horizontal: 'never' }}>
          <TouchableOpacity style={ styles.header } onPress={ navigateToAccount }>
            <Icon name="person" />
            { isAuthenticated && <Text>{ this.props.user.username }</Text> }
          </TouchableOpacity>
          <DrawerItems { ...otherItemsProps } itemsContainerStyle={ styles.itemsContainer } />
          { restaurantSection }
          { courierSection }
          { adminSection }
        </SafeAreaView>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  itemsContainer: {
    paddingVertical: 0
  },
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  }
});

function mapStateToProps(state) {

  return {
    user: state.app.user,
    restaurants: state.restaurant.myRestaurants,
  }
}

export default connect(mapStateToProps)(translate()(DrawerContent))
