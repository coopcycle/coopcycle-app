import { Skeleton } from '@/components/ui/skeleton';
import { HStack } from '@/components/ui/hstack';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';

import CartFooterButton from './CartFooterButton';

interface CartFooterProps {
  testID: string;
  isLoading?: boolean;
  disabled?: boolean;
}

class CartFooter extends Component<CartFooterProps> {
  render() {
    const { cart, restaurant, initLoading } = this.props;

    return (
      <HStack testID="cartFooter">
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}>
          {initLoading && (
            <Skeleton h="10" w={'100%'} startColor={'cyan.500'} />
          )}
          {!initLoading && (
            <CartFooterButton
              cart={cart}
              restaurant={restaurant}
              onPress={() => this.props.onSubmit()}
              loading={this.props.isLoading}
              testID={this.props.testID}
              disabled={this.props.disabled}
            />
          )}
        </View>
      </HStack>
    );
  }

  static defaultProps = {
    disabled: false,
  };
}

function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.checkout.isLoading,
  };
}

export default connect(mapStateToProps)(withTranslation()(CartFooter));
