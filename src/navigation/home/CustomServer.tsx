import { Button, ButtonText } from '@/components/ui/button';
import { Center } from '@/components/ui/center';
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';

import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { InteractionManager, View } from 'react-native';
import { connect } from 'react-redux';

import { selectServer } from '../../redux/App/actions';

class CustomServer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      serverError: false,
      errorMessage: '',
    };
  }

  handleForm() {
    this.props.selectServer(this.state.text.trim());
  }

  render() {
    const itemProps = { isInvalid: this.props.hasError };

    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex:1
      }}>
        <VStack className="w-full px-4">
          <FormControl {...itemProps}>
            <Input size="md">
              <InputField
                autoCapitalize={'none'}
                autoCorrect={false}
                placeholder={`${this.props.t('EXAMPLE')} : demo.coopcycle.org`}
                onChangeText={text => this.setState({ text })}
                returnKeyType="done"
                onSubmitEditing={this.handleForm.bind(this)}
                testID="customServerURL"
                autoCompleteType="off"
              />
            </Input>
            {this.props.hasError && (
              <FormControlError>
                <FormControlErrorText className="text-red-500">
                  {this.props.message}
                </FormControlErrorText>
              </FormControlError>
            )}
            <View style={{ paddingVertical: 15 }}>
              <Button
                block
                onPress={this.handleForm.bind(this)}
                testID="submitCustomServer">
                <ButtonText>{this.props.t('SUBMIT')}</ButtonText>
              </Button>
            </View>
          </FormControl>
        </VStack>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    hasError: !!state.app.selectServerError,
    message: state.app.selectServerError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectServer: server => dispatch(selectServer(server)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(CustomServer));
