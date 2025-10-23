import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import React, { Component } from 'react';

interface FooterButtonProps {
  text: string;
  testID?: string;
  onPress?(...args: unknown[]): unknown;
}

class FooterButton extends Component<FooterButtonProps> {
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

export default FooterButton;
