import React, { useState } from 'react'
import { Dimensions, Pressable, StyleSheet, View, useColorScheme, SafeAreaView } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Box, Button, Center, HStack, Heading, Icon, ScrollView, Skeleton, Text, VStack } from 'native-base';
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
import OpeningHours from './components/OpeningHours';
import Modal from 'react-native-modal';
import { phonecall } from 'react-native-communications';
import AddressUtils from '../../utils/Address';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Fix: key prop warning
// https://github.com/GeekyAnts/NativeBase/issues/4473
const LoadingPhantom = () => <Center>
  <HStack space={8} p="6">
    <VStack flex="3" space="4">
      <Skeleton flex={1} rounded="md"  />
      <Skeleton.Text flex={1} noOfLines={2} lineHeight={2} />
    </VStack>
    <Skeleton flex="1" h="100" w="100" rounded="md" />
  </HStack>
  <HStack space={8} p="6">
    <VStack flex="3" space="4">
      <Skeleton flex={1} rounded="md" />
      <Skeleton.Text flex={1} noOfLines={2} lineHeight={2} />
    </VStack>
    <Skeleton flex="1" h="100" w="100" rounded="md" />
  </HStack>
  <HStack space={8} p="6">
    <VStack flex="3" space="4">
      <Skeleton flex={1} rounded="md" />
      <Skeleton.Text flex={1} noOfLines={2} lineHeight={2} />
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
  const { height } = Dimensions.get('window')
  const colorScheme = useColorScheme()
  const [ infoModal, setInfoModal ] = useState(false)
  const { showFooter, httpClient, restaurant } = props

  const nextOpeningDateCheck = _.has(restaurant, 'nextOpeningDate')
  const isAvailable = (hasValidTiming(restaurant.timing.collection)) ||
  hasValidTiming(restaurant.timing.delivery)

  const { isLoading, isError, data } = useQuery([ 'menus', restaurant.hasMenu ], async () => {
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

  const cardStyle = {
    ...styles.card,
    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
    borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingTop: 60 }}>
        <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60 }}>
          <GroupImageHeader image={ restaurant.image } text={restaurant.name} onInfo={() => setInfoModal(true)} />
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


      <Modal
        testID={'modal'}
        isVisible={infoModal}
        onBackdropPress={() => setInfoModal(false)}
        style={styles.view}
      >
        <View maxHeight={height * 0.7}>
        <ScrollView>
        <VStack style={styles.content} backgroundColor={colorScheme === 'dark' ? 'dark.100' : 'white'} space={3}>
          <Box style={styles.center}>
            <Heading>{restaurant.name}</Heading>
            <Text>{restaurant.description}</Text>
            <Text bold padding={3}>{i18n.t('RESTAURANT_OPENING_HOURS')}</Text>
            <OpeningHours restaurant={restaurant} />
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
        </VStack>
        </ScrollView>
        </View>
      </Modal>

      <ExpiredSessionModal
        onModalHide={ () => navigate('CheckoutHome') } />
    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 22,
    borderTopStartRadius: 4,
    borderTopRightRadius: 4,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 12,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

function mapStateToProps(state, ownProps) {

  const restaurant = ownProps.route.params?.restaurant
  const cart = state.checkout.carts[restaurant['@id']]?.cart
  const cartLoading = _.includes(state.checkout.loadingCarts, restaurant['@id'])
  const isCartEmpty = !state.checkout.carts[restaurant['@id']] ? true : cart.items.length === 0

  return {
    showFooter: cartLoading || !isCartEmpty,
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
