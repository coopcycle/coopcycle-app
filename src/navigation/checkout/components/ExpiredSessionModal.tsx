import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import { hideExpiredSessionModal } from '../../../redux/Checkout/actions';

const ExpiredSessionModal = ({ isVisible, onModalHide, hideExpiredSessionModal }) => {

  const { t } = useTranslation()

  return (
    <Modal
      isVisible={isVisible}
      onModalHide={onModalHide}>
      <Box className="bg-background-50 p-4">
        <Box className="p-4 bg-error-800 mb-4">
          <Text className="text-error-100 text-center">
            {t('SESSION_EXPIRED')}
          </Text>
        </Box>
        <Button block onPress={hideExpiredSessionModal}>
          <ButtonText>{t('GO_BACK_TO_RESTAURANTS')}</ButtonText>
        </Button>
      </Box>
    </Modal>
  );
}

ExpiredSessionModal.propTypes = {
  onModalHide: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  modalText: {
    padding: 10,
    backgroundColor: '#f2dede',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#a94442',
    marginBottom: 10,
  },
});

function mapStateToProps(state) {
  const isVisible =
    state.checkout.isAddressModalHidden &&
    state.checkout.isSessionExpired &&
    state.checkout.isExpiredSessionModalVisible;

  return {
    isVisible,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideExpiredSessionModal: () => dispatch(hideExpiredSessionModal()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExpiredSessionModal);
