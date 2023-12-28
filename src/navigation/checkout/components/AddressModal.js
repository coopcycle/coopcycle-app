import React, { Component } from 'react'
import { ActivityIndicator, Animated, Dimensions, Keyboard, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import {
  Button, Icon, Text,
} from 'native-base'
import Modal from 'react-native-modal'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AddressAutocomplete from '../../../components/AddressAutocomplete'
import ModalContent from '../../../components/ModalContent'
import AddressUtils from '../../../utils/Address'

import { hideAddressModal, setAddress, setAddressModalHidden, setFulfillmentMethod } from '../../../redux/Checkout/actions'
import { selectIsCollectionEnabled } from '../../../redux/Checkout/selectors'
import i18n from '../../../i18n';

class AddressModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      shouldShowBackBtn: false,
      address: '',
      disableDefaultBtn: false,
    }
    this.keyboardHeight = new Animated.Value(0)
  }

  componentDidMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove()
    this.keyboardWillHideSub.remove()
  }

  keyboardWillShow(event) {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: event.endCoordinates.height,
        useNativeDriver: false,
      }),
    ]).start();
  }

  keyboardWillHide(event) {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
        useNativeDriver: false,
      }),
    ]).start();
  }

  renderLoader() {
    if (!this.props.isLoading) {
      return (
        <View />
      )
    }

    const { width } = Dimensions.get('window')

    return (
      <View style={ [ styles.goBackContainer, { width }] }>
        <ActivityIndicator size="small" />
      </View>
    )
  }

  render() {

    const { width, height } = Dimensions.get('window')

    const modalMessageTextStyle = [
      styles.modalMessageText,
    ]
    if (this.props.isAddressOK === false) {
      modalMessageTextStyle.push(styles.modalMessageTextError)
    }

    return (
      <Modal
        isVisible={ this.props.isModalVisible }
        style={ styles.bottomModal }
        onSwipeComplete={ this.props.hideAddressModal }
        onBackdropPress={ this.props.hideAddressModal }
        swipeDirection={ [ 'up', 'down' ] }
        onModalWillShow={ () => this.props.setAddressModalHidden(false) }
        onModalHide={ () => this.props.setAddressModalHidden(true) }>
        <ModalContent as={ SafeAreaView }>
          <Animated.View style={ [ styles.modalContent, { paddingBottom: this.keyboardHeight }] } testID="addressModal">
            <Text style={ modalMessageTextStyle }>{ this.props.message }</Text>
            <View style={{ width, height: height / 3 }}>
              <View style={ styles.autocompleteContainer }>
                <AddressAutocomplete
                  testID="addressModalTypeahead"
                  onSelectAddress={this.props.onSelect}
                  value={ this.props.value?.streetAddress }
                  inputContainerStyle={{
                    justifyContent: 'center',
                    borderWidth: 0,
                    paddingHorizontal: 10,
                  }}
                  style={{
                    borderRadius: 3,
                  }}
                  autoFocus={ true }
                  onFocus={ () => this.setState({ shouldShowBackBtn: false }) }
                  onBlur={ () => this.setState({ shouldShowBackBtn: true }) }
                  onChangeText={() => this.setState({ disableDefaultBtn: true })}
                  addresses={this.props.savedAddresses}
                  />
              </View>
            </View>
            { this.renderLoader() }
          </Animated.View>
        </ModalContent>
      </Modal>
    )
  }
}

AddressModal.defaultProps = {
  value: null,
}

AddressModal.propTypes = {
  onSelect: PropTypes.func.isRequired,
  value: PropTypes.object,
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    position: 'absolute',
    ...Platform.select({
      android: {
        flex: 1,
        top: 0,
        right: 0,
        left: 0,
        zIndex: 1,
      },
      ios: {
        top: 0,
        right: 0,
        left: 0,
        zIndex: 10,
        overflow: 'visible',
      },
    }),
  },
  modalContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalMessageText: {
    fontSize: 14,
    padding: 15,
  },
  modalMessageTextError: {
    color: '#E74C3C',
    fontSize: 14,
  },
  goBackContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'absolute',
    top: '40%',
    left: 0,
    paddingHorizontal: 15,
  },
});

function mapStateToProps(state, ownProps) {
  let savedAddresses;
  if (ownProps.value !== null) {
    savedAddresses = [
      ownProps.value,
      ...state.account.addresses.slice(0, 2),
    ]
  } else {
    savedAddresses = state.account.addresses.slice(0, 3)
  }

  return {
    address: state.checkout.address,
    isAddressOK: state.checkout.isAddressOK,
    isModalVisible: state.checkout.isAddressModalVisible,
    isLoading: state.checkout.isLoading,
    message: state.checkout.isLoading ? ownProps.t('LOADING') : state.checkout.addressModalMessage,
    isCollectionEnabled: selectIsCollectionEnabled(state),
    savedAddresses,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setAddress: (address, cart) => dispatch(setAddress(address, cart)),
    hideAddressModal: () => dispatch(hideAddressModal()),
    setAddressModalHidden: (isHidden) => dispatch(setAddressModalHidden(isHidden)),
    setFulfillmentMethod: (method) => dispatch(setFulfillmentMethod(method)),
  }
}

// Make sure to enchance like this, to have the "t" function available in mapStateToProps
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AddressModal))
