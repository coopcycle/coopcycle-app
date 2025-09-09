import _ from 'lodash';
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import validate from 'validate.js';

import { connect } from 'react-redux';
import i18n from '../i18n';

// Custom validator for matches
// Checks whether the given value matches another value in the object under validation
// Used for password confirmation checks
validate.validators.matches = (value, options, key, attributes) =>
  value === attributes[options.key] ? null : options.message;

const inputs = [
  {
    name: 'password',
    label: i18n.t('PASSWORD'),
    props: {
      secureTextEntry: true,
    },
    constraints: {
      presence: { message: i18n.t('INVALID_PASSWORD') },
      // https://github.com/FriendsOfSymfony/FOSUserBundle/blob/ee76c57c6a0966c24f4f9a693790ecd61bf2ddce/Resources/config/validation.xml#L65-L75
      length: {
        minimum: 8,
        maximum: 4096,
        message: i18n.t('INVALID_PASSWORD'),
      },
    },
  },
  {
    name: 'passwordConfirmation',
    label: i18n.t('CONFIRM_PASSWORD'),
    props: {
      secureTextEntry: true,
    },
    constraints: {
      presence: { message: i18n.t('INVALID_PASSWORD_CONFIRMATION') },
      matches: {
        key: 'password',
        message: i18n.t('INVALID_PASSWORD_CONFIRMATION'),
      },
    },
  },
];

const CONSTRAINTS = _.reduce(
  inputs,
  (acc, { name, constraints }) => ({ ...acc, [name]: constraints }),
  {},
);

class NewPasswordForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      password: this.props.prefill === true ? '12345678' : '',
      passwordConfirmation: this.props.prefill === true ? '12345678' : '',
      errors: {},
    };

    this._inputComponents = new Map();
    this._onSubmit.bind(this);
  }

  _onSubmit() {
    const { errors, ...data } = this.state;
    const newErrors = validate(data, CONSTRAINTS, { fullMessages: false });

    if (newErrors) {
      this.setState({
        errors: newErrors,
      });

      return;
    }

    this.props.onSubmit(data.password);
  }

  renderErrors(errors) {
    return (
      <FormControlError>
        {errors.map((message, key) => (
          <FormControlErrorText
            key={key}>
            {message}
          </FormControlErrorText>
        ))}
      </FormControlError>
    );
  }

  render() {
    const { errors } = this.state;

    return (
      <View>
        <>
          {inputs.map(input => {
            const hasErrors = errors.hasOwnProperty(input.name);
            const itemProps = hasErrors ? { error: true } : {};

            return (
              <View key={input.name}>
                <FormControl {...itemProps} className="mb-3">
                  <FormControlLabel>
                    <FormControlLabelText>{input.label}</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      ref={component =>
                        this._inputComponents.set(input.name, component)
                      }
                      defaultValue={this.state[input.name]}
                      autoCorrect={false}
                      autoCapitalize="none"
                      style={{ height: 40 }}
                      onChangeText={value =>
                        this.setState({ [input.name]: value })
                      }
                      {...input.props}
                      returnKeyType="next"
                      onSubmitEditing={event => {
                        let index = inputs.findIndex(
                          el => el.name === input.name,
                        );
                        if (inputs.length >= index + 2) {
                          let nextInputName = inputs[index + 1].name;
                          this._inputComponents.get(nextInputName).focus();
                        } else {
                          this._onSubmit();
                        }
                      }}
                    />
                  </Input>
                  {hasErrors && this.renderErrors(errors[input.name])}
                </FormControl>
              </View>
            );
          })}
        </>
        <View style={{ marginTop: 20 }}>
          <Button block onPress={() => this._onSubmit()}>
            <ButtonText>{this.props.t('SUBMIT')}</ButtonText>
          </Button>
          <Text
            className="text-error-300"
            style={{
              marginTop: 15,
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
    nonInputError: state.app.lastAuthenticationError,
  };
}

export default connect(mapStateToProps)(withTranslation()(NewPasswordForm));
