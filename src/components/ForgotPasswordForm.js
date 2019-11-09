import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {Form, Item, Input, Label, Button, Text} from 'native-base';
import material from '../../native-base-theme/variables/material';
import {withTranslation} from 'react-i18next';

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: undefined,
    };

    this._onSubmit.bind(this);
  }

  _onSubmit() {
    const {username} = this.state;
    this.props.onSubmit(username);
  }

  render() {
    const itemProps = this.props.inputError ? {error: true} : {};

    return (
      <View>
        <Form>
          <Item stackedLabel {...itemProps}>
            <Label>{this.props.t('USERNAME_OR_EMAIL')}</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="done"
              onChangeText={username => this.setState({username})}
              onSubmitEditing={_ => this._onSubmit()}
            />
          </Item>
        </Form>
        <View style={{marginTop: 20}}>
          <Button block onPress={() => this._onSubmit()}>
            <Text>{this.props.t('SUBMIT')}</Text>
          </Button>
          <Text
            style={{
              marginTop: 15,
              color: material.inputErrorBorderColor,
            }}>
            {this.props.nonInputError}
          </Text>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    inputError: state.app.forgotPassword.inputError,
    nonInputError: state.app.forgotPassword.nonInputError,
  };
}

export default connect(mapStateToProps)(withTranslation()(ForgotPasswordForm));
