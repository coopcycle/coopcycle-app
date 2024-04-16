import { Formik } from 'formik';
import { Box, Button, FormControl, Input, Text, VStack } from 'native-base';
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
          <Box p="4" borderWidth="1" borderColor="gray.700">
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
                    <FormControl.Label>
                      {this.props.t('VOUCHER_CODE')}
                    </FormControl.Label>
                    <Input
                      autoCorrect={false}
                      autoCapitalize="none"
                      style={{ height: 40 }}
                      returnKeyType="done"
                      onChangeText={handleChange('code')}
                      onBlur={handleBlur('code')}
                    />
                  </FormControl>
                  <Button block onPress={handleSubmit}>
                    <Text>{this.props.t('SUBMIT')}</Text>
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
