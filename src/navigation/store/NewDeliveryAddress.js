import React, { Component } from 'react'
import { Platform, StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { Text } from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

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

    let autocompleteProps = {
      inputContainerStyle: {
        flex: 1,
        borderWidth: 0,
      },
    }
    if (!_.isEmpty(this.props.error)) {
      autocompleteProps = {
        ...autocompleteProps,
        inputContainerStyle: {
          ...autocompleteProps.inputContainerStyle,
          ...styles.errorInput,
        },
      }
    }

    return (
      <KeyboardAvoidingView
        style={ styles.content }
        behavior="padding"
        >
        <Text style={ styles.label }>
          { this.props.t('STORE_NEW_DELIVERY_ADDRESS') }
        </Text>
        <Text style={ styles.help } note>
          { this.props.t('STORE_NEW_DELIVERY_ADDRESS_HELP') }
        </Text>
        <View style={ styles.container }>
          <View style={ styles.autocompleteContainer }>
            <AddressAutocomplete
              googleApiKey={ this.props.googleApiKey }
              country={ this.props.country }
              addresses={ this.props.addresses }
              onSelectAddress={ this._onSelectAddress.bind(this) }
              containerStyle={{
                flex: 1,
                justifyContent: 'center',
              }}
              { ...autocompleteProps } />
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    height: 54,
    marginHorizontal: 10,
  },
  // @see https://github.com/mrlaessig/react-native-autocomplete-input#android
  autocompleteContainer: {
    position: 'absolute',
    height: 54,
    width: '100%',
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
  formGroup: {
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'green',
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
    googleApiKey: state.app.settings.google_api_key,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    assertDelivery: (delivery, onSuccess) => dispatch(assertDelivery(delivery, onSuccess)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(NewDelivery))
