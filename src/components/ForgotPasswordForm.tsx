import { Formik } from 'formik';
import _ from 'lodash';
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';

import i18n from '../i18n';

class ForgotPasswordForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: undefined,
    };
  }

  _validate(values) {
    let errors = {};

    if (_.isEmpty(values.username)) {
      errors.username = i18n.t('INVALID_USERNAME');
    }

    return errors;
  }

  _onSubmit(values) {
    const { username } = values;
    this.props.onSubmit(username);
  }

  render() {
    const initialValues = {
      username: '',
    };

    return (
      <Formik
        initialValues={initialValues}
        validate={this._validate.bind(this)}
        onSubmit={this._onSubmit.bind(this)}
        validateOnBlur={false}
        validateOnChange={false}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => {
          const hasError = field => touched[field] && Boolean(errors[field]);
          const getError = field => errors[field];

          return (
            <View>
              <FormControl isInvalid={hasError('username')}>
                <FormControlLabel>
                  <FormControlLabelText>{this.props.t('USERNAME_OR_EMAIL')}</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    _stack={{ style: {} }}
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="done"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    onSubmitEditing={handleSubmit}
                  />
                </Input>
                {hasError('username') ? (
                  <FormControlError>
                    <FormControlErrorText>
                      {getError('username')}
                    </FormControlErrorText>
                  </FormControlError>
                ) : null}
              </FormControl>
              <View style={{ marginTop: 20 }}>
                <Button block onPress={handleSubmit}>
                  <ButtonText>{this.props.t('SUBMIT')}</ButtonText>
                </Button>
                <Text
                  style={{
                    marginTop: 15,
                  }}
                  className="text-error-400">
                  {this.props.nonInputError}
                </Text>
              </View>
            </View>
          );
        }}
      </Formik>
    );
  }
}

function mapStateToProps(state) {
  return {
    nonInputError: state.app.forgotPassword.nonInputError,
  };
}

export default connect(mapStateToProps)(withTranslation()(ForgotPasswordForm));
