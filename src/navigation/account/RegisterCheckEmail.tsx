import { CommonActions } from '@react-navigation/native';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon, MailIcon } from '@/components/ui/icon';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class RegisterCheckEmail extends Component {
  _onPressLogin() {
    const loginRouteName =
      this.props.route.params?.loginRouteName || 'AccountHome';

    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name: loginRouteName }],
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {
    const email = this.props.route.params?.email || '';

    return (
      <Center flex={1} testID="registerCheckEmail" className="px-4">
        <Icon as={MailIcon} className="mb-3" />
        <Text style={{ textAlign: 'center' }}>
          {this.props.t('REGISTER_CHECK_EMAIL_DISCLAIMER', { email })}
        </Text>
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: 'center' }} note>
            {this.props.t('REGISTER_CHECK_EMAIL_ALREADY_ACTIVATED')}
          </Text>
          <Button onPress={() => this._onPressLogin()}>
            <ButtonText>{this.props.t('REGISTER_CHECK_EMAIL_LOGIN')}</ButtonText>
          </Button>
        </View>
      </Center>
    );
  }
}

export default withTranslation()(RegisterCheckEmail);
