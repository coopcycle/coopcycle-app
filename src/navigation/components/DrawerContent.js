import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import {Text, Icon, HStack, Pressable, Center, Box} from 'native-base'
import _ from 'lodash'
import { connect } from 'react-redux'
import { withTranslation, useTranslation } from 'react-i18next'
import {
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'
import { SafeAreaView } from 'react-native-safe-area-context'
import VersionNumber from 'react-native-version-number'
import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber'
import { phonecall } from 'react-native-communications'
import Ionicons from 'react-native-vector-icons/Ionicons'

import Mailto from '../../components/Mailto'
import { selectIsAuthenticated, selectShowRestaurantsDrawerItem } from '../../redux/App/selectors'
import {NativeBaseProvider} from 'native-base/src/core/NativeBaseProvider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const phoneNumberUtil = PhoneNumberUtil.getInstance()

const RestaurantsDrawerItem = ({ restaurants, navigate }) => {

  const { t } = useTranslation()

  if (restaurants.length === 1) {

    return (
      <DrawerItem
        label={ _.first(restaurants).name }
        onPress={ () => navigate('RestaurantNav') } />
    )
  }

  return (
    <DrawerItem
      label={ t('RESTAURANTS') }
      onPress={ () => navigate('RestaurantNav') } />
  )
}

const StoresDrawerItem = ({ stores, navigate }) => {

  const { t } = useTranslation()

  if (stores.length === 1) {

    return (
      <DrawerItem
        label={ _.first(stores).name }
        onPress={ () => navigate('StoreNav') } />
    )
  }

  return (
    <DrawerItem
      label={ t('STORES') }
      onPress={ () => navigate('StoreNav') } />
  )
}

class DrawerContent extends Component {

  render() {

    const {
      restaurants,
      stores,
      user,
      isAuthenticated,
      showRestaurantsDrawerItem,
      // // This is coming from drawer navigator
      // descriptors,
      // state,
      // ...rest
    } = this.props

    const navigateToAccount = () =>
      this.props.navigation.navigate('AccountNav')

    const navigateToAbout = () =>
      this.props.navigation.navigate('AboutNav')

    const navigateToTerms = () =>
      this.props.navigation.navigate('TermsNav')

    const navigateToPricacy = () =>
      this.props.navigation.navigate('PrivacyNav')

    let phoneNumberText = this.props.phoneNumber
    if (this.props.phoneNumber) {
      try {
        phoneNumberText = phoneNumberUtil.format(
          phoneNumberUtil.parse(this.props.phoneNumber),
          PhoneNumberFormat.NATIONAL
        )
      } catch (e) {}
    }

    return <>
      <SafeAreaView style={ styles.container } forceInset={{ top: 'always', horizontal: 'never' }}>
        <TouchableOpacity style={ styles.header } onPress={ navigateToAccount } testID="drawerAccountBtn">
          <Icon as={ Ionicons } name="person" />
          { isAuthenticated && <Text>{ this.props.user.username }</Text> }
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={ styles.content }>
            <DrawerContentScrollView {...this.props}>
              <DrawerItem
                label={ this.props.t('SEARCH') }
                onPress={ () => this.props.navigation.navigate('CheckoutNav') } />
              { showRestaurantsDrawerItem && (
                <RestaurantsDrawerItem restaurants={ restaurants } navigate={ this.props.navigation.navigate } />
              ) }
              { (isAuthenticated && user.hasRole('ROLE_STORE') && stores.length > 0) && (
                <StoresDrawerItem stores={ stores } navigate={ this.props.navigation.navigate } />
              ) }
              { (isAuthenticated && user.hasRole('ROLE_COURIER')) && (
                <DrawerItem
                  label={ this.props.t('TASKS') }
                  onPress={ () => this.props.navigation.navigate('CourierNav') } />
              ) }
              { (isAuthenticated && user.hasRole('ROLE_ADMIN')) && (
                <DrawerItem
                  label={ this.props.t('DISPATCH') }
                  onPress={ () => this.props.navigation.navigate('DispatchNav') } />
              ) }
            </DrawerContentScrollView>
          </View>
          <View style={ styles.footer }>
            { this.props.showAbout && (
              <TouchableOpacity onPress={ navigateToAbout } style={ styles.footerItem }>
                <Text style={{ fontWeight: '700' }}>{ this.props.brandName }</Text>
              </TouchableOpacity>
            )}
            { !this.props.showAbout && (
              <View style={ styles.footerItem }>
                <Text style={{ fontWeight: '700' }}>{ this.props.brandName }</Text>
              </View>
            )}
            { this.props.email && (
              <Mailto email={ this.props.email } style={ styles.footerItem }>
                <Text style={{ fontSize: 14 }}>{ this.props.email }</Text>
              </Mailto>
            )}
            { this.props.phoneNumber && (
              <TouchableOpacity onPress={ () => phonecall(this.props.phoneNumber, true) } style={ styles.footerItem }>
                <Text style={{ fontSize: 14 }}>{ phoneNumberText }</Text>
              </TouchableOpacity>
            )}
            <View style={ styles.footerItem }>
              <Text note>{ VersionNumber.appVersion }</Text>
            </View>
            <HStack w="100%" my="2" alignItems="center" justifyContent="space-between">
              <Pressable w="50%"
                onPress={ navigateToTerms }>
                <Text p="2" textAlign="center" fontSize="sm">{ this.props.t('TERMS_OF_SERVICE') }</Text>
              </Pressable>
              <Pressable w="50%"
                onPress={ navigateToPricacy }>
                <Text p="2" textAlign="center" fontSize="sm">{ this.props.t('PRIVACY') }</Text>
              </Pressable>
            </HStack>
          </View>
        </View>
      </SafeAreaView>
    </>
  }
}

const styles = StyleSheet.create({
  itemsContainer: {
    paddingVertical: 0,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 25,
  },
  content: {
    flex: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  footer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  footerItem: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
})

function mapStateToProps(state) {

  const publicServers =
    _.filter(state.app.servers, s => !!s.coopcycle_url)

  const showAbout =
    _.includes(publicServers.map(s => s.coopcycle_url), state.app.baseURL)

  return {
    user: state.app.user,
    isAuthenticated: selectIsAuthenticated(state),
    restaurants: state.restaurant.myRestaurants,
    stores: state.store.myStores,
    brandName: state.app.settings['brand_name'],
    phoneNumber: state.app.settings['phone_number'],
    email: state.app.settings['administrator_email'],
    showAbout,
    showRestaurantsDrawerItem: selectShowRestaurantsDrawerItem(state),
  }
}

export default connect(mapStateToProps)(withTranslation()(DrawerContent))
