import { Button, HStack } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FooterButton extends Component {
  render() {
    const { text, ...otherProps } = this.props;

    return (
      <HStack p="3">
        <Button w="100%" {...otherProps}>
          {text}
        </Button>
      </HStack>
    );
  }
}

FooterButton.propTypes = {
  text: PropTypes.string.isRequired,
  testID: PropTypes.string,
  onPress: PropTypes.func,
};

export default FooterButton;
