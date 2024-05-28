import _ from 'lodash';
import { Text } from 'native-base';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import AddressAutocomplete from '../../components/AddressAutocomplete';

import { assertDelivery } from '../../redux/Store/actions';
import { selectStore } from '../../redux/Store/selectors';

function NewDelivery(props) {
  // const [extraScrollHeight, setExtraScrollHeight] = useState(0);

  function onSelectAddress(address) {
    const delivery = {
      store: props.store['@id'],
      dropoff: {
        address,
        // FIXME It shouldn't be necessary to send this
        before: 'tomorrow 12:00',
      },
    };

    props.assertDelivery(delivery, () => {
      props.navigation.navigate('StoreNewDeliveryForm', { address });
    });
  }

  let autocompleteProps = {
    inputContainerStyle: {
      flex: 1,
      borderWidth: 0,
    },
  };

  if (!_.isEmpty(props.error)) {
    autocompleteProps = {
      ...autocompleteProps,
      inputContainerStyle: {
        ...autocompleteProps.inputContainerStyle,
        ...styles.errorInput,
      },
    };
  }

  return (
    <KeyboardAvoidingView style={styles.content} behavior="position">
      <Text style={styles.label}>{props.t('STORE_NEW_DELIVERY_ADDRESS')}</Text>
      <View style={styles.container}>
        <View style={styles.autocompleteContainer}>
          <AddressAutocomplete
            addresses={props.addresses}
            onSelectAddress={onSelectAddress}
            containerStyle={{
              flex: 1,
              justifyContent: 'center',
            }}
            style={{ borderRadius: 0 }}
            {...autocompleteProps}
          />
        </View>
        <Text style={styles.help} note>
          {props.t('STORE_NEW_DELIVERY_ADDRESS_HELP')}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: 10,
  },
  // @see https://github.com/mrlaessig/react-native-autocomplete-input#android
  autocompleteContainer: {
    position: 'absolute',
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
  label: {
    paddingVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  help: {
    paddingVertical: 5,
    textAlign: 'center',
    paddingTop: 50,
  },
  errorInput: {
    borderColor: '#FF4136',
  },
});

function mapStateToProps(state) {
  return {
    store: selectStore(state),
    error: state.store.assertDeliveryError,
    addresses: state.store.addresses,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    assertDelivery: (delivery, onSuccess) =>
      dispatch(assertDelivery(delivery, onSuccess)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(NewDelivery));
