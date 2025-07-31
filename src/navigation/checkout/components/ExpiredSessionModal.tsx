import { Button, Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';

import { hideExpiredSessionModal } from '../../../redux/Checkout/actions';

class ExpiredSessionModal extends Component {
  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        onModalHide={this.props.onModalHide}>
        <View style={styles.modalContent}>
          <View style={styles.modalText}>
            <Text style={{ color: '#a94442', textAlign: 'center' }}>
              {this.props.t('SESSION_EXPIRED')}
            </Text>
          </View>
          <Button block onPress={this.props.hideExpiredSessionModal}>
            <Text>{this.props.t('GO_BACK_TO_RESTAURANTS')}</Text>
          </Button>
        </View>
      </Modal>
    );
  }
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
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 15,
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
)(withTranslation()(ExpiredSessionModal));
