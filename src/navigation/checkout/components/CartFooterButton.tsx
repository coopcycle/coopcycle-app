import React, { Component } from 'react';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react-native'
import { Text } from '@/components/ui/text';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Animated, View } from 'react-native';

import { formatPrice } from '../../../utils/formatting';
import {
  isRestaurantOrderingAvailable,
  shouldShowPreOrder,
} from '../../../utils/checkout';

class CartFooterButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacityAnim: new Animated.Value(1),
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cart.total !== prevProps.cart.total) {
      this.animate();
    }
  }

  animate() {
    Animated.sequence([
      Animated.timing(this.state.opacityAnim, {
        toValue: 0.4,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(this.state.opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }

  renderLeft() {
    return (
      <ButtonIcon
        as={ShoppingCart}
        size="sm"
        className="mr-1"
      />
    );
  }

  renderRight() {
    return (
      <Animated.View style={{ opacity: this.state.opacityAnim }}>
        <ButtonText>
          {`${formatPrice(this.props.cart.total)}`}
        </ButtonText>
      </Animated.View>
    );
  }

  render() {
    const { cart, restaurant } = this.props;

    const isAvailable = isRestaurantOrderingAvailable(restaurant);
    const showPreOrder = shouldShowPreOrder(restaurant);

    if (!cart || cart.items.length === 0 || !isAvailable) {
      return <View />;
    }

    const label = showPreOrder
      ? this.props.t('SCHEDULE_ORDER')
      : this.props.t('ORDER');

    return (
      <Button
        onPress={this.props.onPress}
        testID={this.props.testID}
        isLoading={this.props.loading}
        isDisabled={this.props.disabled}
        className="w-full px-4"
        >
          {this.renderLeft()}
          <ButtonText>
            {label}
          </ButtonText>
          {this.renderRight()}
      </Button>
    );
  }

  static defaultProps = {
    isLoading: false,
    disabled: false,
  };
}

CartFooterButton.propTypes = {
  testID: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default withTranslation()(CartFooterButton);
