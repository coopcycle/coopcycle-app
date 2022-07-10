import React, { Component } from 'react';
import { Button, Center, Icon, Text } from 'native-base';
import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

class ResetPasswordCheckEmail extends Component {
  _onPressClose() {
    this.props.navigation.popToTop();
  }

  render() {
    const email = this.props.route.params?.email || ''

    return (
      <Center flex={ 1 } testID="registerCheckEmail">
        <Icon as={ FontAwesome } name="envelope-o" mb="3" />
        <Text style={{ textAlign: 'center' }}>
          {this.props.t('RESET_PASSWORD_CHECK_EMAIL_DISCLAIMER', { email })}
        </Text>
        <Button
          style={{ marginTop: 20 }}
          block
          transparent
          onPress={() => this._onPressClose()}>
          <Text>{this.props.t('CLOSE')}</Text>
        </Button>
      </Center>
    );
  }
}

export default withTranslation()(ResetPasswordCheckEmail);
