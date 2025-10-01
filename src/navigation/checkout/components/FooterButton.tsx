import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class FooterButton extends Component {
  render() {
    const { text, ...otherProps } = this.props;

    return (
      <HStack className="p-3">
        <Button className="w-full" {...otherProps}>
          <ButtonText>{text}</ButtonText>
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
