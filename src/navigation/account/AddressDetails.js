import React, { Component } from 'react';
import { loadAddresses, newAddress } from '../../redux/Account/actions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Button, Divider, FormControl, Heading, Input } from 'native-base';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';

class AddressDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { name: '', description: '' };
  }

  render() {
    const { latitude, longitude } = this.props.address.geo;
    const { width } = Dimensions.get('window');
    const LATITUDE_DELTA = 0.002;
    const LONGITUDE_DELTA = LATITUDE_DELTA * (width / (width * 0.55));

    const _save = () => {
      this.props.newAddress({ ...this.props.address, ...this.state });
      this.props.navigation.goBack();
    };

    return (
      <KeyboardAdjustView style={{ flex: 1 }} androidBehavior={''}>
        <MapView
          style={{
            height: width * 0.55,
            width: width,
          }}
          liteMode={true}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
        <ScrollView style={{ padding: 15 }}>
          <Heading>{this.props.address.streetAddress}</Heading>
          <Divider style={{ margin: 10 }} />
          <FormControl mb="5">
            <FormControl.Label>{this.props.t('NAME')}</FormControl.Label>
            <Input
              onChange={({ nativeEvent: { text } }) =>
                this.setState({ name: text })
              }
            />
          </FormControl>

          <FormControl mb="5">
            <FormControl.Label>
              {this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION')}
            </FormControl.Label>
            <Input
              multiline
              numberOfLines={3}
              onChange={({ nativeEvent: { text } }) =>
                this.setState({ description: text })
              }
            />
            <FormControl.HelperText>
              {this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION_HELP')}
            </FormControl.HelperText>
          </FormControl>
        </ScrollView>
        <View
          style={{
            padding: 20,
          }}>
          <Button mt="2" onPress={_save}>
            {this.props.t('SAVE_AND_CONTINUE')}
          </Button>
        </View>
      </KeyboardAdjustView>
    );
  }
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
