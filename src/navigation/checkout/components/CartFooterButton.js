import React, { Component } from 'react';
import { ActivityIndicator, Animated, View } from 'react-native';
import { Button, HStack, Text } from 'native-base';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { formatPrice } from '../../../utils/formatting';

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
      <Text style={{ fontWeight: 'bold', fontFamily: 'OpenSans-Regular' }}>
        {`[${this.props.cart.items.length}]`}
      </Text>
    );
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
    const { cart } = this.props;

    if (!cart || cart.items.length === 0) {
      return <View />;
    }

    return (
      <Button
        onPress={this.props.onPress}
        testID={this.props.testID}
        isLoading={this.props.loading}
        isDisabled={this.props.disabled}
        _stack={{ w: '100%', justifyContent: 'center' }}>
        <HStack alignItems="center" justifyContent="space-between">
          {this.renderLeft()}
          <Text mx="8">{this.props.t('ORDER')}</Text>
          {this.renderRight()}
        </HStack>
      </Button>
    );
  }
}

CartFooterButton.defaultProps = {
  disabled: false,
};

CartFooterButton.propTypes = {
  testID: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default withTranslation()(CartFooterButton);
