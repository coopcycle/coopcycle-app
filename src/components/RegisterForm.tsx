import { Formik } from 'formik';
import _ from 'lodash';
import {
  Button,
  Checkbox,
  Column,
  FormControl,
  Input,
  ScrollView,
  Text,
} from 'native-base';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import { connect } from 'react-redux';
import validate from 'validate.js';

import NavigationHolder from '../NavigationHolder';
import i18n from '../i18n';
import {
  acceptPrivacyPolicy,
  acceptTermsAndConditions,
} from '../redux/App/actions';

// Custom validator for matches
// Checks whether the given value matches another value in the object under validation
// Used for password confirmation checks
validate.validators.matches = (value, options, key, attributes) =>
  value === attributes[options.key] ? null : options.message;

const inputs = [
  {
    name: 'email',
    label: i18n.t('EMAIL'),
    props: {
      keyboardType: 'email-address',
    },
    constraints: {
      presence: { message: i18n.t('INVALID_EMAIL') },
      email: {
        message: i18n.t('INVALID_EMAIL'),
      },
    },
  },
  {
    name: 'username',
    label: i18n.t('USERNAME'),
    constraints: {
      presence: { message: i18n.t('INVALID_USERNAME') },
      // https://github.com/coopcycle/coopcycle-web/blob/82220bc36dd3c44e6e770abee022c6f736f4228c/src/AppBundle/Entity/ApiUser.php#L40-L45
      length: {
        minimum: 3,
        maximum: 15,
        message: i18n.t('INVALID_USERNAME'),
      },
      format: {
        pattern: /^[a-zA-Z0-9_]{3,15}$/,
        message: i18n.t('INVALID_USERNAME_FORMAT'),
      },
    },
  },
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
  {
    name: 'givenName',
    label: i18n.t('GIVEN_NAME'),
    constraints: {
      presence: { message: i18n.t('INVALID_GIVEN_NAME') },
      length: {
        minimum: 1,
        message: i18n.t('INVALID_GIVEN_NAME'),
      },
    },
  },
  {
    name: 'familyName',
    label: i18n.t('FAMILY_NAME'),
    constraints: {
      presence: { message: i18n.t('INVALID_FAMILY_NAME') },
      length: {
        minimum: 1,
        message: i18n.t('INVALID_FAMILY_NAME'),
      },
    },
    isLast: true,
  },
];

let CONSTRAINTS = _.reduce(
  inputs,
  (acc, { name, constraints }) => ({ ...acc, [name]: constraints }),
  {},
);

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openTermsAndConditions: false,
      openPrivacyPolicy: false,
    };

    this._inputComponents = new Map();

    this._setTermsAndConditionsValue = null;
    this._setPrivacyPolicyValue = null;
  }

  componentDidUpdate() {
    if (this.state.openTermsAndConditions) {
      this._setTermsAndConditionsValue(this.props.termsAndConditionsAccepted);
    }
    if (this.state.openPrivacyPolicy) {
      this._setPrivacyPolicyValue(this.props.privacyPolicyAccepted);
    }
  }

  renderError(message) {
    return <FormControl.ErrorMessage>{message}</FormControl.ErrorMessage>;
  }

  _validate(values) {
    return _.mapValues(
      validate(values, CONSTRAINTS, { fullMessages: false }),
      messages => _.first(messages),
    );
  }

  _onSubmit(values) {
    this.props.onSubmit(values);
  }

  _renderLegalTexts(values, allErrors, setFieldValue, handleBlur) {
    if (this.props.splitTermsAndConditionsAndPrivacyPolicy) {
      return this._renderTermsAndPrivacyPolicyTexts(
        values,
        allErrors,
        setFieldValue,
        handleBlur,
      );
    }
    return this._renderLegalField(
      'legal',
      this.props.t('LEGAL_TEXTS_LABEL'),
      this.props.t('LEGAL_TEXTS_ERROR_MESSAGE'),
      values,
      allErrors,
      setFieldValue,
      handleBlur,
    );
  }

  _onTermsAndConditionsChanged = checked => {
    if (checked) {
      this.setState({ openTermsAndConditions: true });
      return NavigationHolder.navigate('TermsNav', {
        screen: 'TermsHome',
        params: { showConfirmationButtons: true },
      });
    } else {
      this.props.acceptTermsAndConditions(false);
    }
  };

  _onPrivacyPolicyChanged = checked => {
    if (checked) {
      this.setState({ openPrivacyPolicy: true });
      return NavigationHolder.navigate('PrivacyNav', {
        screen: 'PrivacyHome',
        params: { showConfirmationButtons: true },
      });
    } else {
      this.props.acceptPrivacyPolicy(false);
    }
  };

  _renderTermsAndPrivacyPolicyTexts(
    values,
    allErrors,
    setFieldValue,
    handleBlur,
  ) {
    const termsAndConditionsField = this._renderLegalField(
      'termsAndConditions',
      this.props.t('TERMS_AND_CONDITIONS_LABEL'),
      this.props.t('TERMS_AND_CONDITIONS_ERROR_MESSAGE'),
      values,
      allErrors,
      setFieldValue,
      handleBlur,
      this.props.t('TERMS_AND_CONDITIONS_BUTTON_LABEL'),
      this._onTermsAndConditionsChanged,
    );

    const privacyPolicyField = this._renderLegalField(
      'privacyPolicy',
      this.props.t('PRIVACY_POLICY_LABEL'),
      this.props.t('PRIVACY_POLICY_ERROR_MESSAGE'),
      values,
      allErrors,
      setFieldValue,
      handleBlur,
      this.props.t('PRIVACY_POLICY_BUTTON_LABEL'),
      this._onPrivacyPolicyChanged,
    );

    this._setTermsAndConditionsValue = value => {
      setFieldValue('termsAndConditions', value);
    };

    this._setPrivacyPolicyValue = value => {
      setFieldValue('privacyPolicy', value);
    };

    return (
      <>
        {termsAndConditionsField}
        {privacyPolicyField}
      </>
    );
  }

  _renderLegalField(
    fieldName,
    label,
    errorMessage,
    values,
    allErrors,
    setFieldValue,
    handleBlur,
    buttonLabel,
    _onChangeCB,
  ) {
    const constraints = {
      presence: { message: errorMessage },
      inclusion: {
        within: [true],
        message: errorMessage,
      },
    };

    inputs.push({
      name: fieldName,
      constraints,
      notRender: true,
    });

    CONSTRAINTS = {
      ...CONSTRAINTS,
      [fieldName]: constraints,
    };

    const hasError = allErrors.hasOwnProperty(fieldName);

    const _handleChange = checked => {
      setFieldValue(fieldName, checked);

      if (this.props.splitTermsAndConditionsAndPrivacyPolicy) {
        _onChangeCB(checked);
      }
    };

    const _handleNavPress = buttonNav => {
      return NavigationHolder.navigate(`${buttonNav}Nav`, {
        screen: `${buttonNav}Home`,
        params: { showConfirmationButtons: false },
      });
    };

    const _isChecked = () => {
      if (this.props.splitTermsAndConditionsAndPrivacyPolicy) {
        if (fieldName === 'termsAndConditions') {
          return this.props.termsAndConditionsAccepted;
        } else if (fieldName === 'privacyPolicy') {
          return this.props.privacyPolicyAccepted;
        }
      }
      return values[fieldName];
    };

    return (
      <FormControl my="2" isInvalid={hasError}>
        <Checkbox
          size="sm"
          mr="4"
          name={fieldName}
          isChecked={_isChecked()}
          onChange={checked => _handleChange(checked)}
          onBlur={handleBlur(fieldName)}
          testID={`registerForm.${fieldName}`}
          ref={component => this._inputComponents.set(fieldName, component)}
          defaultValue={values[fieldName]}>
          <Text px={2} fontSize="sm">
            {label}
          </Text>
        </Checkbox>
        {hasError && this.renderError(errorMessage)}
        {this.props.splitTermsAndConditionsAndPrivacyPolicy ? (
          <FormControl.HelperText>
            <Button
              size="sm"
              variant="link"
              testID={`${fieldName}Link`}
              onPress={() => _handleChange(true)}>
              {buttonLabel}
            </Button>
          </FormControl.HelperText>
        ) : (
          <FormControl.HelperText>
            <Button
              size="sm"
              variant="link"
              testID="termsAndConditionsLink"
              onPress={() => _handleNavPress('Terms')}>
              {this.props.t('TERMS_AND_CONDITIONS_BUTTON_LABEL')}
            </Button>
            <Button
              size="sm"
              variant="link"
              testID="privacyPolicyLink"
              onPress={() => _handleNavPress('Privacy')}>
              {this.props.t('PRIVACY_POLICY_BUTTON_LABEL')}
            </Button>
          </FormControl.HelperText>
        )}
      </FormControl>
    );
  }

  render() {
    const initialValues = {
      email: this.props.prefill === true ? 'john.doe@coopcycle.org' : '',
      username: this.props.prefill === true ? 'johndoe' : '',
      password: this.props.prefill === true ? '12345678' : '',
      passwordConfirmation: this.props.prefill === true ? '12345678' : '',
      givenName: this.props.prefill === true ? 'John' : '',
      familyName: this.props.prefill === true ? 'Doe' : '',
      legal: false,
      termsAndConditions: this.props.termsAndConditionsAccepted,
      privacyPolicy: this.props.privacyPolicyAccepted,
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
          setFieldValue,
        }) => {
          const allErrors = {
            ...errors,
            ...this.props.errors,
          };

          return (
            <Column flex={1}>
              <ScrollView
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}>
                {inputs.map((input, index) => {
                  if (input.notRender) {
                    return;
                  }

                  const hasError = allErrors.hasOwnProperty(input.name);
                  const itemProps = hasError ? { error: true } : {};

                  let inputProps = {
                    ...input.props,
                    onChangeText: handleChange(input.name),
                    onBlur: handleBlur(input.name),
                  };

                  if (input.isLast) {
                    inputProps = {
                      ...inputProps,
                      returnKeyType: 'done',
                      onSubmitEditing: handleSubmit,
                    };
                  } else {
                    inputProps = {
                      ...inputProps,
                      returnKeyType: 'next',
                      onSubmitEditing: event => {
                        const idx = inputs.findIndex(
                          el => el.name === input.name,
                        );
                        const nextInputName = inputs[idx + 1].name;
                        const nextInput =
                          this._inputComponents.get(nextInputName);
                        if (nextInput) {
                          nextInput.focus();
                        }
                      },
                    };
                  }

                  return (
                    <FormControl
                      {...itemProps}
                      key={input.name}
                      isInvalid={hasError}>
                      <FormControl.Label>{input.label}</FormControl.Label>
                      <Input _stack={{ style: {} }}
                        testID={`registerForm.${input.name}`}
                        ref={component =>
                          this._inputComponents.set(input.name, component)
                        }
                        defaultValue={values[input.name]}
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={{ height: 40 }}
                        {...inputProps}
                      />
                      {hasError && this.renderError(allErrors[input.name])}
                    </FormControl>
                  );
                })}

                {this._renderLegalTexts(
                  values,
                  allErrors,
                  setFieldValue,
                  handleBlur,
                )}
              </ScrollView>
              <View style={{ marginTop: 20 }}>
                <Button block onPress={handleSubmit} testID="submitRegister">
                  {this.props.t('SUBMIT')}
                </Button>
              </View>
            </Column>
          );
        }}
      </Formik>
    );
  }
}

function mapStateToProps(state) {
  return {
    errors: state.app.registrationErrors,
    splitTermsAndConditionsAndPrivacyPolicy:
      state.app.settings.split_terms_and_conditions_and_privacy_policy,
    termsAndConditionsAccepted: state.app.termsAndConditionsAccepted,
    privacyPolicyAccepted: state.app.privacyPolicyAccepted,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    acceptTermsAndConditions: accepted =>
      dispatch(acceptTermsAndConditions(accepted)),
    acceptPrivacyPolicy: accepted => dispatch(acceptPrivacyPolicy(accepted)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(RegisterForm));
