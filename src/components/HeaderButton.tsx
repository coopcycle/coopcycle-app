import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from 'react-navigation-header-buttons';
import { usePrimaryContentColor } from '../styles/theme';

const HeaderButtonComponent = props => {
  const color = usePrimaryContentColor();

  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={24}
      color={color}
      buttonStyle={{ backgroundColor: 'transparent' }}
    />
  );
};

const HeaderButtonsWrapper = ({ children }) => {
  return (
    <HeaderButtons HeaderButtonComponent={HeaderButtonComponent}>
      {children}
    </HeaderButtons>
  );
};

const ItemWrapper = (props) => {
  const defaultColor = usePrimaryContentColor();
  const { color, disabled, style, ...restProps } = props;
  const opacity = disabled ? 0.4 : 1;

  return (
    <Item
      {...restProps}
      disabled={disabled}
      // A caller may highlight a button (an active filter, say); otherwise it
      // takes the header's content color.
      color={color ?? defaultColor}
      style={{ ...style, opacity }}
    />
  );
};

export {
  HeaderButtonsWrapper as HeaderButtons,
  ItemWrapper as HeaderButton,
}
