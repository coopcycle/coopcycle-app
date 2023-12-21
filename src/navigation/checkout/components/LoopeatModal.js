import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box, Button, Text } from 'native-base'
import Modal from 'react-native-modal'

import { selectCart, selectRestaurant } from '../../../redux/Checkout/selectors'
import { updateCart, stopAskingToEnableReusablePackaging } from '../../../redux/Checkout/actions'

const LoopeatModal = ({ name, isVisible, onPress }) => {

  const { t } = useTranslation()
  const [ isHidden, setHidden ] = useState(false)

  return (
    <Modal
      isVisible={ isVisible && !isHidden }
      swipeDirection={ [ 'down', 'up', 'left', 'right' ] }
      onSwipeComplete={ () => setHidden(true) }
      onBackdropPress={ () => setHidden(true) }
    >
      <Box bgColor="white" p="4">
        <Text mb="3">{ t('CART_ZERO_WASTE_POPUP_TEXT', { name: name || '' }) }</Text>
        <Button onPress={ onPress }>
          { t('CART_ZERO_WASTE_POPUP_BUTTON_TEXT') }
        </Button>
      </Box>
    </Modal>
  );
}

function mapStateToProps(state) {

  const restaurant = selectRestaurant(state)
  const { cart } = selectCart(state)

  if (!restaurant.loopeatEnabled) {

    return {
      isVisible: false
    }
  }

  if (!cart) {

    return {
      isVisible: false
    }
  }

  if (cart.reusablePackagingEnabled || cart.reusablePackagingQuantity === 0) {

    return {
      isVisible: false
    }
  }

  if (state.checkout.isLoading || state.checkout.isFetching) {

    return {
      isVisible: false
    }
  }

  return {
    name: cart.loopeatContext?.name,
    isVisible: state.checkout.shouldAskToEnableReusablePackaging,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    onPress: () => {
      dispatch(updateCart({ reusablePackagingEnabled: true }))
      dispatch(stopAskingToEnableReusablePackaging())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoopeatModal)
