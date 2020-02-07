import React, { Component } from 'react'
import { Platform, StyleSheet, View } from 'react-native'
import { Text } from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import AddressAutocomplete from '../../components/AddressAutocomplete'

import { assertDelivery } from '../../redux/Store/actions'
import { selectStore } from '../../redux/Store/selectors'

class NewDelivery extends Component {

  constructor(props) {
    super(props)

    this.state = {
      extraScrollHeight: 0,
    }
  }

  _onSelectAddress(address) {

    const delivery = {
      store: this.props.store['@id'],
      dropoff: {
        address,
        // FIXME It shouldn't be necessary to send this
        before: 'tomorrow 12:00',
      },
    }

    this.props.assertDelivery(delivery, () => {
      this.props.navigation.navigate('StoreNewDeliveryForm', { address })
    })
  }

  render() {

    let autocompleteProps = {}
    if (!_.isEmpty(this.props.error)) {
      autocompleteProps = {
        ...autocompleteProps,
        inputContainerStyle: styles.errorInput,
      }
    }

    return (
      <KeyboardAwareScrollView
        contentContainerStyle={ styles.content }
        extraScrollHeight={ this.state.extraScrollHeight }
        onLayout={ event => {
          const { height } = event.nativeEvent.layout
          this.setState({ extraScrollHeight: (height / 2) - 100 })
        }}
        keyboardShouldPersistTaps="always"
        enableOnAndroid={ true }>
        <View style={ styles.container }>
          <View style={ styles.autocompleteContainer }>
            <View style={ [ styles.formGroup ] }>
              <Text style={ styles.label }>
                { this.props.t('STORE_NEW_DELIVERY_ADDRESS') }
              </Text>
              <AddressAutocomplete
                country={ this.props.country }
                addresses={ this.props.addresses }
                onSelectAddress={ this._onSelectAddress.bind(this) }
                { ...autocompleteProps } />
              <Text style={ styles.help } note>
                { this.props.t('STORE_NEW_DELIVERY_ADDRESS_HELP') }
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignSelf: 'stretch',
  },
  // @see https://github.com/mrlaessig/react-native-autocomplete-input#android
  autocompleteContainer: {
    ...Platform.select({
      android: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1,
      },
    }),
  },
  formGroup: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  label: {
    paddingVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  help: {
    paddingVertical: 5,
    textAlign: 'center',
  },
  errorInput: {
    borderColor: '#FF4136',
  },
})

function mapStateToProps(state) {

  return {
    store: selectStore(state),
    error: state.store.assertDeliveryError,
    addresses: state.store.addresses,
    country: state.app.settings.country,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    assertDelivery: (delivery, onSuccess) => dispatch(assertDelivery(delivery, onSuccess)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(NewDelivery))
