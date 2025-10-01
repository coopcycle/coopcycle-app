import { Icon, MailIcon } from '@/components/ui/icon';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';

class ResetPasswordCheckEmail extends Component {
  _onPressClose() {
    this.props.navigation.popToTop();
  }

  render() {
    const email = this.props.route.params?.email || '';

    return (
      <Center flex={1} testID="registerCheckEmail" className="px-4">
        <Icon as={MailIcon} size="xl" className="mb-3" />
        <Text style={{ textAlign: 'center' }} className="mb-4">
          {this.props.t('RESET_PASSWORD_CHECK_EMAIL_DISCLAIMER', { email })}
        </Text>
        <Button
          onPress={() => this._onPressClose()}>
          <ButtonText>{this.props.t('CLOSE')}</ButtonText>
        </Button>
      </Center>
    );
  }
}

export default withTranslation()(ResetPasswordCheckEmail);
