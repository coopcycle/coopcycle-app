import React, { Component } from 'react';
import { HeaderButtons, HeaderButton } from '../../../components/HeaderButton';

class HeaderRight extends Component {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <HeaderButtons>
        <HeaderButton
          title="search"
          iconName="search"
          onPress={() => navigate('RestaurantSearch')}
        />
        <HeaderButton
          title="openSettings"
          iconName="settings-outline"
          onPress={() => navigate('RestaurantSettings')}
        />
      </HeaderButtons>
    );
  }
}

export default HeaderRight;
