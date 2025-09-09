import {
  FormControl,
  FormControlLabel,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabelText,
} from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, ScrollView, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import { loadAddresses, newAddress } from '../../redux/Account/actions';

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
      <KeyboardAdjustView style={{ flex: 1 }}>
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
          <Divider className="my-3" />
          <FormControl className="mb-5">
            <FormControlLabel>
              <FormControlLabelText>{this.props.t('NAME')}</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                onChange={({ nativeEvent: { text } }) =>
                  this.setState({ name: text })
                }
              />
            </Input>
          </FormControl>

          <FormControl className="mb-5">
            <FormControlLabel>
              <FormControlLabelText>{this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION')}</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                multiline
                numberOfLines={3}
                onChange={({ nativeEvent: { text } }) =>
                  this.setState({ description: text })
                }
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                {this.props.t('CHECKOUT_ORDER_ADDRESS_DESCRIPTION_HELP')}
              </FormControlHelperText>
            </FormControlHelper>
          </FormControl>
        </ScrollView>
        <View
          style={{
            padding: 20,
          }}>
          <Button className="mt-2" onPress={_save}>
            <ButtonText>{this.props.t('SAVE_AND_CONTINUE')}</ButtonText>
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
