import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Button, Center, HStack, Heading, Skeleton, Text, VStack } from 'native-base';
import _ from 'lodash'
import moment from 'moment'

import CartFooter from './components/CartFooter'
import ExpiredSessionModal from './components/ExpiredSessionModal'

import Menu from '../../components/Menu'

import { hideAddressModal, setAddress } from '../../redux/Checkout/actions'
import DangerAlert from '../../components/DangerAlert';
import { shouldShowPreOrder } from '../../utils/checkout'
import { useQuery } from 'react-query';
import i18n from '../../i18n';
import GroupImageHeader from './components/GroupImageHeader';
import AddressModal from './components/AddressModal';

// Fix: key prop warning
// https://github.com/GeekyAnts/NativeBase/issues/4473
const LoadingPhantom = () => <Center w="100%">
  <HStack w="95%" space={8} p="4">
    <VStack flex="3" space="4">
      <Skeleton flex={1} />
      <Skeleton.Text flex={1} noOfLines={2} lineHeight={2} />
      <HStack space="2" alignItems="center">
        <Skeleton size="4" rounded="full" />
        <Skeleton h="3" flex="2" rounded="full" />
        <Skeleton h="3" flex="1" rounded="full" startColor="cyan.300" />
      </HStack>
    </VStack>
    <Skeleton flex="1" h="100" w="100" rounded="md" />
  </HStack>
  <HStack w="95%" space={8} p="4">
    <VStack flex="3" space="4">
      <Skeleton flex={1} />
      <Skeleton.Text flex={1} noOfLines={2} lineHeight={2} />
      <HStack space="2" alignItems="center">
        <Skeleton size="4" rounded="full" />
        <Skeleton h="3" flex="2" rounded="full" />
        <Skeleton h="3" flex="1" rounded="full" />
      </HStack>
    </VStack>
    <Skeleton flex="1" h="100" w="100" rounded="md" />
  </HStack>
  <HStack w="95%" space={8} p="4">
    <VStack flex="3" space="4">
      <Skeleton flex={1} />
      <Skeleton.Text flex={1} noOfLines={2} lineHeight={2} />
      <HStack space="2" alignItems="center">
        <Skeleton size="4" rounded="full" />
        <Skeleton h="3" flex="2" rounded="full" />
        <Skeleton h="3" flex="1" rounded="full" startColor="amber.300" />
      </HStack>
    </VStack>
    <Skeleton flex="1" h="100" w="100" rounded="md" />
  </HStack>
</Center>

function hasValidTiming(timing) {
  return timing !== null && timing.range[0] !== timing.range[1]
}

function renderNotAvailableWarning(restaurant, isAvailable) {
  if (isAvailable) {
    return (
      <DangerAlert
        text={`${i18n.t('RESTAURANT_CLOSED_AND_NOT_AVAILABLE', {
          datetime: moment(restaurant.nextOpeningDate).calendar(moment(), {
            sameElse: 'llll',
          }),
        })}`}
      />
    )
  }
}

function renderClosedNowWarning(restaurant, isAvailable) {
  if (isAvailable && shouldShowPreOrder(restaurant) && restaurant.nextOpeningDate) {
    return (
      <DangerAlert
        adjustsFontSizeToFit={true}
        text={`${i18n.t('RESTAURANT_CLOSED_BUT_OPENS', {
          datetime: moment(restaurant.nextOpeningDate).calendar(moment(), {
            sameElse: 'llll',
          }),
        })}`}
      />
    )
  }
}

function Restaurant(props) {
  const { navigate } = props.navigation
  const { showFooter, httpClient, restaurant } = props
  const nextOpeningDateCheck = _.has(restaurant, 'nextOpeningDate')
  const isAvailable = (hasValidTiming(restaurant.timing.collection)) ||
  hasValidTiming(restaurant.timing.delivery)

  const { isLoading, isError, data } = useQuery(['menus', restaurant.hasMenu], async () => {
    return await httpClient.get(restaurant.hasMenu, {}, { anonymous: true })
  })

  //TODO: improve failed view
  if (isError) {
    return <Center w="95%">
      <Heading>{i18n.t('AN_ERROR_OCCURRED')} </Heading>
      <Text>{i18n.t('TRY_LATER')}</Text>
      <Button>{i18n.t('RETRY')}</Button>
    </Center>
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 60 }}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60 }}>
          <GroupImageHeader image={ restaurant.image } text={restaurant.name} />
        </View>
        { nextOpeningDateCheck && renderNotAvailableWarning(restaurant, isAvailable) }
        { nextOpeningDateCheck && renderClosedNowWarning(restaurant, isAvailable) }
        { isLoading && LoadingPhantom() }
        { !isLoading && <Menu
          restaurant={ restaurant }
          menu={ data }
          onItemClick={ menuItem => navigate('CheckoutProductDetails', { product: menuItem, restaurant }) }
          isItemLoading={ menuItem => props.loadingItems.includes(menuItem.identifier) } /> }
      </View>
      { showFooter && (
        <CartFooter
          onSubmit={ () => navigate('CheckoutSummary', { restaurant }) }
          cart={props.cart}
          initLoading={props.cartLoading}
          testID="cartSubmit"
          disabled={ isLoading } />
      ) }
      <AddressModal
        onGoBack={ (address) => {
          this.props.hideAddressModal()
          navigate('CheckoutHome', { address })
        }} />
      <ExpiredSessionModal
        onModalHide={ () => navigate('CheckoutHome') } />
    </View>
  )
}

function mapStateToProps(state, ownProps) {

  const restaurant = ownProps.route.params?.restaurant
  const cart = state.checkout.cart
  const cartLoading = state.checkout.isLoading
  const isCartEmpty = !state.checkout.cart ? true : state.checkout.cart.items.length === 0
  const isSameRestaurant = restaurant['@id'] === cart?.restaurant

  return {
    showFooter: isSameRestaurant && (cartLoading || !isCartEmpty),
    cartLoading,
    restaurant,
    cart,
    address: state.checkout.address,
    loadingItems: state.checkout.itemRequestStack,
    isExpiredSessionModalVisible: state.checkout.isExpiredSessionModalVisible,
    httpClient: state.app.httpClient,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setAddress: address => dispatch(setAddress(address)),
    hideAddressModal: () => dispatch(hideAddressModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Restaurant))
