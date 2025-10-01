import React from 'react';
import { HeaderButton, HeaderButtons } from '../../components/HeaderButton';

const HeaderRightButton = ({ onPress }) => {
  return (
    <HeaderButtons>
      <HeaderButton
        iconName="calendar-number-outline"
        onPress={onPress}
      />
    </HeaderButtons>
  );
}

export default HeaderRightButton;
