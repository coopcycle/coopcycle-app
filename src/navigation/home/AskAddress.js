import {fontTitleName, lightGreyColor, primaryColor, whiteColor} from '../../styles/common';
import {Box, Center, Heading, Text} from 'native-base';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import {Image, View} from 'react-native';
import React from 'react';
import {_setAddress} from '../../redux/Checkout/actions';
import {loadAddresses, newAddress} from '../../redux/Account/actions';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import i18n from '../../i18n';

const AskAddress = (props) => {
  const textInputContainerHeight = 54
  return <View style={{backgroundColor: primaryColor, flex: 1, padding: 20}}>
    <Box style={{flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
    <Heading color={whiteColor}>Où êtes vous ?</Heading>
    <Text color={lightGreyColor}>Nous utilisons votre adresse pour vous aider à trouver les meilleurs commerces à proximité.</Text>
    </Box>
    <Box style={{flex:2}}>
    <AddressAutocomplete
      inputContainerStyle={{
        justifyContent: 'center',
        borderWidth: 0,
        padding: 15,
        height: textInputContainerHeight,
      }}
      style={{
        height: (textInputContainerHeight * 0.7),
        borderRadius: 3,
        borderWidth: 0,
        backgroundColor: whiteColor,
      }}
      country={ props.country }
      location={ props.location }
      onSelectAddress={ (address) => {
        props.newAddress(address)
        props.setAddress(address)
      }}
    />
    </Box>
  </View>
}


function mapStateToProps(state) {

  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    addresses: state.account.addresses,
    address: state.checkout.address,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadAddresses: () => dispatch(loadAddresses()),
    newAddress: address => dispatch(newAddress(address)),
    setAddress: address => dispatch(_setAddress(address)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AskAddress))
