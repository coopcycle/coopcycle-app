import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import classNames from 'classnames';
import { Button, ButtonText } from '@/components/ui/button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import {
  stopAskingToEnableReusablePackaging,
  updateCart,
} from '../../../redux/Checkout/actions';
import {
  selectCart,
  selectRestaurant,
} from '../../../redux/Checkout/selectors';

const LoopeatModal = ({ name, isVisible, onPress }) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [isHidden, setHidden] = useState(false);

  return (
    <Modal
      isVisible={isVisible && !isHidden}
      swipeDirection={['down', 'up', 'left', 'right']}
      onSwipeComplete={() => setHidden(true)}
      onBackdropPress={() => setHidden(true)}>
      <Box className={classNames('p-4', {
        'bg-background-light': colorScheme !== 'dark',
        'bg-background-dark': colorScheme === 'dark',
      })}>
        <Text className="mb-3">
          {t('CART_ZERO_WASTE_POPUP_TEXT', { name: name || '' })}
        </Text>
        <Button testID="reusablePackagingOk" onPress={onPress}>
          <ButtonText>{t('CART_ZERO_WASTE_POPUP_BUTTON_TEXT')}</ButtonText>
        </Button>
      </Box>
    </Modal>
  );
};

function mapStateToProps(state) {
  const restaurant = selectRestaurant(state);
  const { cart } = selectCart(state);

  if (!restaurant.loopeatEnabled) {
    return {
      isVisible: false,
    };
  }

  if (!cart) {
    return {
      isVisible: false,
    };
  }

  if (cart.reusablePackagingEnabled || cart.reusablePackagingQuantity === 0) {
    return {
      isVisible: false,
    };
  }

  if (state.checkout.isLoading || state.checkout.isFetching) {
    return {
      isVisible: false,
    };
  }

  return {
    name: cart.loopeatContext?.name,
    isVisible: state.checkout.shouldAskToEnableReusablePackaging,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onPress: () => {
      dispatch(updateCart({ reusablePackagingEnabled: true }));
      dispatch(stopAskingToEnableReusablePackaging());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoopeatModal);
