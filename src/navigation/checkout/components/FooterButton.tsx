import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import React, { Component } from 'react';

interface FooterButtonProps {
  text: string;
  testID?: string;
  loading?: boolean;
  onPress?(...args: unknown[]): unknown;
}

class FooterButton extends Component<FooterButtonProps> {
  render() {
    const { text, loading, ...otherProps } = this.props;

    return (
      <HStack className="p-3">
        <Button className="w-full" {...otherProps} isDisabled={loading}>
          {loading && <ButtonSpinner className="mr-2" />}
          <ButtonText>{text}</ButtonText>
        </Button>
      </HStack>
    );
  }
}

export default FooterButton;
