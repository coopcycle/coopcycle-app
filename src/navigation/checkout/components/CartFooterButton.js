import React, { Component } from 'react';
import { Button, HStack, Icon, Text } from 'native-base';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Animated, View } from 'react-native';

import { formatPrice } from '../../../utils/formatting';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  isRestaurantAvailable,
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
    return <Icon as={FontAwesome} size="xs" name={'shopping-cart'} />;
  }

  renderRight() {
    return (
      <Animated.View style={{ opacity: this.state.opacityAnim }}>
        <Text style={{ fontWeight: 'bold', fontFamily: 'OpenSans-Regular' }}>
          {`${formatPrice(this.props.cart.total)}`}
        </Text>
      </Animated.View>
    );
  }

  render() {
    const { cart, restaurant } = this.props;

    const isAvailable = isRestaurantAvailable(restaurant);
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
        _stack={{ w: '100%', justifyContent: 'center' }}>
        <HStack alignItems="center" justifyContent="space-between">
          {this.renderLeft()}
          <Text mx="2">{label}</Text>
          {this.renderRight()}
        </HStack>
      </Button>
    );
  }
}

CartFooterButton.defaultProps = {
  isLoading: false,
  disabled: false,
};

CartFooterButton.propTypes = {
  testID: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default withTranslation()(CartFooterButton);
