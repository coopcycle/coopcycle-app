import React, { Component } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View, Animated, Keyboard, Platform, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import {
  Text, Button, Icon,
} from 'native-base'
import Modal from 'react-native-modal'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AddressAutocomplete from '../../../components/AddressAutocomplete'
import ModalContent from '../../../components/ModalContent'
import AddressUtils from '../../../utils/Address'

import { setAddressModalHidden, hideAddressModal, setAddress, setFulfillmentMethod } from '../../../redux/Checkout/actions'
import { selectIsCollectionEnabled } from '../../../redux/Checkout/selectors'

class AddressModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      shouldShowBackBtn: false,
      address: '',
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

  renderBackBtn() {

    const shouldShowBackBtn = this.props.isAddressOK === false && !this.props.isLoading && this.state.shouldShowBackBtn

    if (!shouldShowBackBtn) {
      return (
        <View />
      )
    }

    const { width } = Dimensions.get('window')

    return (
      <View style={ [ styles.goBackContainer, { width } ] }>
        <Button bordered info block
          onPress={ () => this.props.onGoBack(this.state.address) }>
          <Text>{ this.props.t('SEARCH_WITH_ADDRESS', { address: this.state.address.streetAddress }) }</Text>
        </Button>
      </View>
    )
  }

  renderLoader() {
    if (!this.props.isLoading) {
      return (
        <View />
      )
    }

    const { width } = Dimensions.get('window')

    return (
      <View style={ [ styles.goBackContainer, { width } ] }>
        <ActivityIndicator size="small" />
      </View>
    )
  }

  renderAutocompleteButton() {

    return (
      <View style={{ alignItems: 'center', paddingHorizontal: 10 }}>
        <TouchableOpacity
          onPress={ () => AddressUtils.getAddressFromCurrentPosition().then(address => {
            this.props.setAddress(address)
            this.setState({ address })
          }) }>
          <Icon as={ MaterialIcons } name="my-location" style={{ color: '#b9b9b9', fontSize: 24 }} />
        </TouchableOpacity>
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
        swipeDirection={ ['up', 'down'] }
        onModalWillShow={ () => this.props.setAddressModalHidden(false) }
        onModalHide={ () => this.props.setAddressModalHidden(true) }>
        <ModalContent as={ SafeAreaView }>
          <Animated.View style={ [ styles.modalContent, { paddingBottom: this.keyboardHeight } ] } testID="addressModal">
            <Text style={ modalMessageTextStyle }>{ this.props.message }</Text>
            <View style={{ width, height: height / 3 }}>
              <View style={ styles.autocompleteContainer }>
                <AddressAutocomplete
                  country={ this.props.country }
                  location={ this.props.location }
                  testID="addressModalTypeahead"
                  onSelectAddress={ (address) => {
                    this.props.setAddress(address, this.props.cart)
                    this.setState({ address })
                  }}
                  value={ this.props.address && this.props.address.streetAddress }
                  inputContainerStyle={{
                    justifyContent: 'center',
                    borderWidth: 0,
                    paddingHorizontal: 10,
                  }}
                  autoFocus={ true }
                  onFocus={ () => this.setState({ shouldShowBackBtn: false }) }
                  onBlur={ () => this.setState({ shouldShowBackBtn: true }) }
                  addresses={ this.props.savedAddresses }
                  renderRight={ this.renderAutocompleteButton.bind(this) }
                  />
              </View>
            </View>
            { this.renderBackBtn() }
            { this.renderLoader() }
            { this.props.isCollectionEnabled && (
              <TouchableOpacity style={{ justifySelf: 'flex-end', backgroundColor: '#dedede', padding: 15 }}
                onPress={ () => this.props.setFulfillmentMethod('collection') }>
                <Text style={{ textAlign: 'center' }}>
                  { this.props.t('FULFILLMENT_METHOD.collection') }
                </Text>
              </TouchableOpacity>
            ) }
          </Animated.View>
        </ModalContent>
      </Modal>
    )
  }
}

AddressModal.propTypes = {
  onGoBack: PropTypes.func.isRequired,
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

  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    address: state.checkout.address,
    isAddressOK: state.checkout.isAddressOK,
    isModalVisible: state.checkout.isAddressModalVisible,
    isLoading: state.checkout.isLoading,
    message: state.checkout.isLoading ? ownProps.t('LOADING') : state.checkout.addressModalMessage,
    isCollectionEnabled: selectIsCollectionEnabled(state),
    savedAddresses: state.account.addresses.slice(0, 3),
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
