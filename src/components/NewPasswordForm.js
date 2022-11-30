import React from 'react';
import { View } from 'react-native';
import { Button, FormControl, Input, Text, VStack } from 'native-base';
import material from '../../native-base-theme/variables/material';
import { withTranslation } from 'react-i18next';
import validate from 'validate.js';
import _ from 'lodash';

import i18n from '../i18n';
import { connect } from 'react-redux';

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
      <View>
        {errors.map((message, key) => (
          <Text
            key={key}
            note
            style={{ marginLeft: 15, color: material.inputErrorBorderColor }}>
            {message}
          </Text>
        ))}
      </View>
    );
  }

  render() {
    const { errors } = this.state;

    return (
      <View>
        <VStack>
          {inputs.map(input => {
            const hasErrors = errors.hasOwnProperty(input.name);
            const itemProps = hasErrors ? { error: true } : {};

            return (
              <View key={input.name}>
                <FormControl stackedLabel {...itemProps}>
                  <FormControl.Label>{input.label}</FormControl.Label>
                  <Input
                    ref={component =>
                      this._inputComponents.set(input.name, component)
                    }
                    defaultValue={this.state[input.name]}
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={{ height: 40 }}
                    onChangeText={value => this.setState({ [input.name]: value })}
                    {...input.props}
                    returnKeyType="next"
                    onSubmitEditing={event => {
                      let index = inputs.findIndex(el => el.name === input.name);
                      if (inputs.length >= (index + 2)) {
                        let nextInputName = inputs[index + 1].name;
                        this._inputComponents.get(nextInputName).focus();
                      } else {
                        this._onSubmit()
                      }
                    }}
                  />
                </FormControl>
                {hasErrors && this.renderErrors(errors[input.name])}
              </View>
            );
          })}
        </VStack>
        <View style={{ marginTop: 20 }}>
          <Button block onPress={() => this._onSubmit()}>
            {this.props.t('SUBMIT')}
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
    nonInputError: state.app.lastAuthenticationError,
  };
}

export default connect(mapStateToProps)(withTranslation()(NewPasswordForm));
