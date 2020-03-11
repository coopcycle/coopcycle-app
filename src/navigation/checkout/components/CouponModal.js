import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Form, Item, Input, Label, Button, Text } from 'native-base'
import { Formik } from 'formik'
import PropTypes from 'prop-types'
import Modal from 'react-native-modal'

class CouponModal extends Component {

  _validate(values) {
    return {}
  }

  _onSubmit(values) {
    this.props.onSubmit(values.code)
  }

  render() {

    const initialValues = {
      code: '',
    }

    return (
      <Modal
        isVisible={ this.props.isVisible }
        onSwipeComplete={ this.props.onSwipeComplete }
        swipeDirection={ ['up', 'down'] }>
        <View style={ styles.modalContent }>
          <Formik
            initialValues={ initialValues }
            validate={ this._validate.bind(this) }
            onSubmit={ this._onSubmit.bind(this) }
            validateOnBlur={ false }
            validateOnChange={ false }>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <Form>
              <Item stackedLabel error={ (touched.code && errors.code) } style={{ marginBottom: 15 }}>
                <Label>{this.props.t('VOUCHER_CODE')}</Label>
                <Input
                  autoCorrect={ false }
                  autoCapitalize="none"
                  style={{ height: 40 }}
                  returnKeyType="done"
                  onChangeText={ handleChange('code') }
                  onBlur={ handleBlur('code') } />
              </Item>
              <Button block onPress={ handleSubmit }>
                <Text>{ this.props.t('SUBMIT') }</Text>
              </Button>
            </Form>
            )}
          </Formik>
        </View>
      </Modal>
    );
  }
}

CouponModal.propTypes = {
  onSwipeComplete: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 15,
  },
})

function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(withTranslation()(CouponModal))
