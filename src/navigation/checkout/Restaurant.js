import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Box, Center, HStack, Heading, Icon, Skeleton, Text, Toast, VStack } from 'native-base';
import _ from 'lodash'
import moment from 'moment'

import CartFooter from './components/CartFooter'
import ExpiredSessionModal from './components/ExpiredSessionModal'

import Menu from '../../components/Menu'

import { setDate, showTimingModal } from '../../redux/Checkout/actions'
import DangerAlert from '../../components/DangerAlert';
import { shouldShowPreOrder } from '../../utils/checkout'
import { useQuery } from 'react-query';
import i18n from '../../i18n';
import GroupImageHeader from './components/GroupImageHeader';
import OpeningHours from './components/OpeningHours';
import { phonecall } from 'react-native-communications';
import AddressUtils from '../../utils/Address';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { selectCart, selectRestaurant } from '../../redux/Checkout/selectors';
import TimingModal from './components/TimingModal';
import BottomModal from '../../components/BottomModal';
import OpeningHoursSpecification from '../../utils/OpeningHoursSpecification';

// Fix: key prop warning
// https://github.com/GeekyAnts/NativeBase/issues/4473
const LoadingPhantom = (props) =>
  <HStack w="95%" space={6} p="4">
    <VStack flex="3" space="3">
      <Skeleton flex={1} />
      <Skeleton.Text flex={1} lines={2} />
      <HStack flex={1} space="2" alignItems="center">
        <Skeleton size="4" rounded="full" />
        <Skeleton h="3" flex="2" rounded="full" />
        <Skeleton h="3" flex="1" rounded="full" startColor={props.color} />
      </HStack>
    </VStack>
    <Skeleton flex="1" h="100" w="100" rounded="md" />
  </HStack>

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
  const colorScheme = useColorScheme()
  const [ infoModal, setInfoModal ] = useState(false)
  const { showFooter, httpClient, restaurant, cart, openingHoursSpecification } = props


  //const nextOpeningDateCheck = _.has(restaurant, 'nextOpeningDate')
  //const isAvailable = (hasValidTiming(restaurant.timing.collection)) ||
  //hasValidTiming(restaurant.timing.delivery)


  const { isLoading, isError, data } = useQuery([ 'menus', restaurant.hasMenu ], async () => {
    return await httpClient.get(restaurant.hasMenu, {}, { anonymous: true })
  })

  useEffect(() => {
    if (!cart) {
      return
    }
    if (
      openingHoursSpecification.currentTimeSlot.state === OpeningHoursSpecification.STATE.Closed &&
      cart?.shippedAt === null
    ) {
      props.showTimingModal({
        displayed: true,
        message: props.t('CHECKOUT_PICK_DATE'),
      })
    }
  }, [cart])

  //TODO: improve failed view
  if (isError) {
    return <Center w="95%">
      <Heading>{i18n.t('AN_ERROR_OCCURRED')} </Heading>
      <Text>{i18n.t('TRY_LATER')}</Text>
    </Center>
  }

  const cardStyle = {
    ...styles.card,
    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
    borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  }
/*
{ nextOpeningDateCheck && renderNotAvailableWarning(restaurant, isAvailable) }
        { nextOpeningDateCheck && renderClosedNowWarning(restaurant, isAvailable) }
 */
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 60 }}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60 }}>
          <GroupImageHeader image={ restaurant.image } text={restaurant.name} onInfo={() => setInfoModal(true)} />
        </View>
        { isLoading && <Center w="100%">
          <LoadingPhantom color={'cyan.200'} />
          <LoadingPhantom color={'gray.200'} />
          <LoadingPhantom color={'amber.200'} />
        </Center> }
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


      <BottomModal isVisible={infoModal}
                   onBackdropPress={() => setInfoModal(false)}
                   onBackButtonPress={() => setInfoModal(false)}
      >
          <Box style={styles.center}>
            <Heading>{restaurant.name}</Heading>
            <Text>{restaurant.description}</Text>
            <Text bold padding={3}>{i18n.t('RESTAURANT_OPENING_HOURS')}</Text>
            <OpeningHours openingHoursSpecification={props.openingHoursSpecification} />
          </Box>
          <Pressable onPress={() => { AddressUtils.openMap(restaurant.address, restaurant.name) }} >
            <HStack space={3} style={cardStyle}>
              <Icon as={Ionicons} name="map" size={5} color={'blueGray.600'} />
              <Text>{restaurant.address.streetAddress}</Text>
            </HStack>
          </Pressable>
          <Pressable onPress={ () => { phonecall(restaurant.telephone, true) } }>
            <HStack space={3} style={cardStyle}>
              <Icon as={Ionicons} name="call" size={5} color={'blueGray.600'} />
              <Text>{i18n.t('CALL')} {restaurant.name}</Text>
            </HStack>
          </Pressable>
      </BottomModal>

      <ExpiredSessionModal
        onModalHide={ () => navigate('CheckoutHome') } />

      <TimingModal
        openingHoursSpecification={props.openingHoursSpecification}
        modalEnabled={showFooter}
        cart={props.cartContainer}
        onClosesSoon={({ timeSlot: { timeSlot } }) => {
          const diff = timeSlot[1].fromNow(false)
          Toast.show({
            description: i18n.t('NOTIFICATION_CLOSES_SOON', { diff }),
            placement: 'top',
          })
        }}
       onSchedule={({ value, showModal }) => {
         props.setDate(value, props.cart, () => showModal(false))
       }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 12,
  },
});

function mapStateToProps(state, ownProps) {

  const { restaurant, openingHoursSpecification } = selectRestaurant(state)
  const cartContainer = selectCart(state)
  const cart = cartContainer?.cart
  const cartLoading = _.includes(state.checkout.loadingCarts, restaurant)
  const isCartEmpty = !selectCart(state) ? true : cart.items.length === 0

  return {
    showFooter: cartLoading || !isCartEmpty,
    cartLoading,
    restaurant,
    openingHoursSpecification,
    cartContainer,
    cart,
    address: state.checkout.address,
    loadingItems: state.checkout.itemRequestStack,
    isExpiredSessionModalVisible: state.checkout.isExpiredSessionModalVisible,
    httpClient: state.app.httpClient,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setDate: (date, cart, cb) => dispatch(setDate(date, cart, cb)),
    showTimingModal: show => dispatch(showTimingModal(show)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Restaurant))
