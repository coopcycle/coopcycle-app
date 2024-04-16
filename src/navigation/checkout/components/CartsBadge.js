import { Text } from 'native-base';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { cartItemsCountBadge } from '../../../redux/Checkout/selectors';

function CartsBadge(props) {
  return <Text color={'white'}>{props.count}</Text>;
}

function mapStateToProps(state) {
  return {
    count: cartItemsCountBadge(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(CartsBadge));
