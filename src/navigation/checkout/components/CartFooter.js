import { HStack, Skeleton } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';

import CartFooterButton from './CartFooterButton';

class CartFooter extends Component {
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
}

CartFooter.defaultProps = {
  disabled: false,
};

CartFooter.propTypes = {
  testID: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

function mapStateToProps(state, ownProps) {
  return {
    isLoading: state.checkout.isLoading,
  };
}

export default connect(mapStateToProps)(withTranslation()(CartFooter));
