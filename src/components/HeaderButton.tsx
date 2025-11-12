import React from 'react';
import { useColorScheme } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  HeaderButton,
  HeaderButtons,
  Item,
} from 'react-navigation-header-buttons';

const HeaderButtonComponent = props => {

  const colorScheme = useColorScheme();

  return (
    <HeaderButton {...props} IconComponent={Ionicons} iconSize={24} color={ colorScheme === 'dark' ? '#fff' : '#000' } />
  );
}

const HeaderButtonsWrapper = ({ children }) => {
  return (
    <HeaderButtons HeaderButtonComponent={HeaderButtonComponent}>
      {children}
    </HeaderButtons>
  );
}

const ItemWrapper = (props) => {
  const colorScheme = useColorScheme();
  const { disabled, ...restProps } = props;

  const color = colorScheme === 'dark' ? '#fff' : '#000';
  const opacity = disabled ? 0.4 : 1;

  return (
    <Item
      {...restProps}
      disabled={disabled}
      color={color}
      style={{ opacity }}
    />
  );
};

export {
  HeaderButtonsWrapper as HeaderButtons,
  ItemWrapper as HeaderButton,
}
