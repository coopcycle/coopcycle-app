import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, ScrollView, View } from 'react-native';
import { Marker } from '@maplibre/maplibre-react-native';

import Map from '@/src/components/map/Map';
import { toPosition } from '@/src/components/map/region';
import AddressMarker from '@/src/components/map/AddressMarker';
import { connect } from 'react-redux';
import { loadAddresses, newAddress } from '../../redux/Account/actions';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { useKeyboardController } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function AddressDetails({ address, navigation, newAddress: saveNewAddress, t }) {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const insets = useSafeAreaInsets();
  const { enabled, setEnabled } = useKeyboardController();

  useEffect(() => {
    setEnabled(true);
  }, [setEnabled])

  const { latitude, longitude } = address.geo;
  const { width } = Dimensions.get('window');
  const LATITUDE_DELTA = 0.002;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / (width * 0.55));

  function save() {
    saveNewAddress({ ...address, name, description });
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={100}
      style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingBottom: insets.bottom, justifyContent: 'space-between' }}>
        <Map
          style={{
            height: width * 0.55,
            width: width,
          }}
          // Decorative: this map only shows where the saved address is.
          interactive={false}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker anchor="bottom" lngLat={toPosition({ latitude, longitude })}>
            <AddressMarker />
          </Marker>
        </Map>
        <ScrollView style={{ padding: 15 }}>
          <Heading>{address.streetAddress}</Heading>
          <Divider className="my-3" />
          <FormControl className="mb-5">
            <FormControlLabel>
              <FormControlLabelText>{t('NAME')}</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                onChange={({ nativeEvent: { text } }) => setName(text)}
              />
            </Input>
          </FormControl>
          <FormControl className="mb-5">
            <FormControlLabel>
              <FormControlLabelText>
                {t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION')}
              </FormControlLabelText>
            </FormControlLabel>
            <Textarea size="md">
              <TextareaInput onChangeText={text => setDescription(text)} />
            </Textarea>
            <FormControlHelper>
              <FormControlHelperText>
                {t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION_HELP')}
              </FormControlHelperText>
            </FormControlHelper>
          </FormControl>
        </ScrollView>
        <View style={{ padding: 20 }}>
          <Button className="mt-2" onPress={save}>
            <ButtonText>{t('SAVE_AND_CONTINUE')}</ButtonText>
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function mapStateToProps(state, ownProps) {
  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    addresses: state.account.addresses,
    address: ownProps.route.params?.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadAddresses: () => dispatch(loadAddresses()),
    newAddress: address => dispatch(newAddress(address)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(AddressDetails));
