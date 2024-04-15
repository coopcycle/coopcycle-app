import React from 'react';
import { withTranslation } from 'react-i18next';
import { Text } from 'native-base';
import { cartItemsCountBadge } from '../../../redux/Checkout/selectors';
import { connect } from 'react-redux';

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
