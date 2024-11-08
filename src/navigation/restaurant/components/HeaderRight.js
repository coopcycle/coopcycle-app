import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from 'react-navigation-header-buttons';
import { connect } from 'react-redux';

const FontAwesomeHeaderButton = props => (
  <HeaderButton {...props} IconComponent={FontAwesome} iconSize={23} />
);

class HeaderRight extends Component {

  render() {
    const { navigate } = this.props.navigation;

    return (
      <HeaderButtons HeaderButtonComponent={FontAwesomeHeaderButton}>
        {/*{!specialOpeningHoursSpecification && (*/}
        {/*  <Item*/}
        {/*    title="close"*/}
        {/*    iconName="power-off"*/}
        {/*    onPress={() => this.onPressClose()}*/}
        {/*  />*/}
        {/*)}*/}
        <Item
          title="openSettings"
          iconName="cog"
          onPress={() => navigate('RestaurantSettings')}
        />
      </HeaderButtons>
    );
  }
}

function mapStateToProps(state) {
  return {
    restaurant: state.restaurant.restaurant,
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(HeaderRight));
