import React, { Component } from 'react'
import { ActivityIndicator, Dimensions, PixelRatio, StyleSheet, View, Animated, Keyboard } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import {
  Text, Button,
} from 'native-base'
import Modal from 'react-native-modal'

import AddressTypeahead from '../../../components/AddressTypeahead'

import { setAddressModalHidden, hideAddressModal, setAddress } from '../../../redux/Checkout/actions'

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
      }),
    ]).start();
  }

  keyboardWillHide(event) {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: event.duration,
        toValue: 0,
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

  render() {

    const { width } = Dimensions.get('window')

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
        <Animated.View style={ [ styles.modalContent, { paddingBottom: this.keyboardHeight } ] } testID="addressModal">
          <View style={{ width, height: 44 + 44 + (44 * 3) }}>
            <View style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={ modalMessageTextStyle }>{ this.props.message }</Text>
            </View>
            <View style={{ height: 44 + (44 * 3) }}>
              <AddressTypeahead
                country={ this.props.country }
                googleApiKey={ this.props.googleApiKey }
                testID="addressModalTypeahead"
                autoFocus={ true }
                style={ typeaheadStyles }
                value={ this.props.address && this.props.address.streetAddress }
                onPress={ (address) => {
                  this.props.setAddress(address)
                  this.setState({ address })
                }}
                renderRow={ rowData => {
                  return (
                    <Text
                      testID={ `placeId:${rowData.place_id}` }
                      style={{ flex: 1, fontWeight: 'bold', fontSize: 14 }}
                      numberOfLines={ 1 }>
                      { rowData.description || rowData.formatted_address || rowData.name }
                    </Text>
                  )
                }}
                onFocus={ () => this.setState({ shouldShowBackBtn: false }) }
                onBlur={ () => this.setState({ shouldShowBackBtn: true }) } />
              { this.renderBackBtn() }
              { this.renderLoader() }
            </View>
          </View>
        </Animated.View>
      </Modal>
    )
  }
}

AddressModal.propTypes = {
  onGoBack: PropTypes.func.isRequired,
}

const typeaheadStyles = {
  textInputContainer: {
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#333333',
  },
}

const styles = StyleSheet.create({
  modalContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalMessageText: {
    fontSize: 14,
  },
  modalMessageTextError: {
    color: '#E74C3C',
    fontSize: 14,
  },
  typeaheadContainer: {
    marginTop: 15,
  },
  typeaheadIconContainer: {
    position: 'absolute',
    right: 0,
    height: 44,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginRight: 8,
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
    googleApiKey: state.app.settings.google_api_key,
    country: state.app.settings.country,
    date: state.checkout.date,
    address: state.checkout.address,
    isAddressOK: state.checkout.isAddressOK,
    isModalVisible: state.checkout.isAddressModalVisible,
    isLoading: state.checkout.isLoading,
    message: state.checkout.isLoading ? ownProps.t('LOADING') : state.checkout.addressModalMessage,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setAddress: address => dispatch(setAddress(address)),
    hideAddressModal: () => dispatch(hideAddressModal()),
    setAddressModalHidden: (isHidden) => dispatch(setAddressModalHidden(isHidden)),
  }
}

// Make sure to enchance like this, to have the "t" function available in mapStateToProps
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AddressModal))
