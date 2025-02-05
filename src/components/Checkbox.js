// https://www.geeksforgeeks.org/how-to-create-a-custom-checkbox-component-in-react-native/

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon, Pressable } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CheckBox = (props) => {

    const { isChecked, onPress, ...otherProps } = props

    const iconName = isChecked ? 'check-square' : 'square-o';

    return (
        <TouchableOpacity onPress={onPress} {...otherProps}>
            <Icon as={FontAwesome} name={iconName} size="sm" />
        </TouchableOpacity>
    );
};

export default CheckBox;
