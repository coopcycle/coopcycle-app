import { Formik } from 'formik';
import { Input, InputField } from '@/components/ui/input';
import { Box } from '@/components/ui/box';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import ModalContent from '../../../components/ModalContent';

class CouponModal extends Component {
  _validate(values) {
    return {};
  }

  _onSubmit(values) {
    this.props.onSubmit(values.code);
  }

  render() {
    const initialValues = {
      code: '',
    };

    return (
      <Modal
        isVisible={this.props.isVisible}
        onSwipeComplete={this.props.onSwipeComplete}
        swipeDirection={['up', 'down']}>
        <ModalContent>
          <Box className="p-4">
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
              }) => (
                <VStack>
                  <FormControl
                    error={touched.code && errors.code}
                    style={{ marginBottom: 15 }}>
                    <FormControlLabel>
                      <FormControlLabelText>{this.props.t('VOUCHER_CODE')}</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={{ height: 40 }}
                        returnKeyType="done"
                        onChangeText={handleChange('code')}
                        onBlur={handleBlur('code')}
                      />
                    </Input>
                  </FormControl>
                  <Button block onPress={handleSubmit}>
                    <ButtonText>{this.props.t('SUBMIT')}</ButtonText>
                  </Button>
                </VStack>
              )}
            </Formik>
          </Box>
        </ModalContent>
      </Modal>
    );
  }
}

CouponModal.propTypes = {
  onSwipeComplete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(withTranslation()(CouponModal));
