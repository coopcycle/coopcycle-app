import React, {Component} from 'react';
import {FlatList, Image, InteractionManager, TouchableOpacity, View} from 'react-native';
import {Box, Button, Divider, Heading, HStack, IconButton, Text, VStack} from 'native-base';
import {connect} from 'react-redux'
import {withTranslation} from 'react-i18next'
import {loadAddresses, newAddress} from '../../redux/Account/actions'
import ItemSeparator from '../../components/ItemSeparator'
import AddressAutocomplete from '../../components/AddressAutocomplete';
import {blueColor, darkGreyColor, greyColor, lightGreyColor, primaryColor} from '../../styles/common';
import {_setAddress} from '../../redux/Checkout/actions';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import address from '../../utils/Address';
import i18n from '../../i18n';
import PropTypes from 'prop-types';
import Address from '../../utils/Address'


class AccountAddressesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      focused: false,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //this.props.loadAddresses()
    })

  }

  _renderRow({ item }) {
    const color = Address.geoDiff(this.props.address, item) ? greyColor : ''
    return (
      <TouchableOpacity onPress={() => {
        this.props.setAddress(item)
        this.props.navigation.goBack()
      }}><HStack px="2" py="3" space={2} style={{backgroundColor: color}} justifyContent="space-between">
        <Text>{ item.streetAddress }</Text><Text>{ item.name }</Text>
      </HStack></TouchableOpacity>
    );
  }

  render() {

    const { addresses } = this.props
    const textInputContainerHeight = 54
    return (
      <View style={{ flex: 1 }}>
        <AddressAutocomplete
        inputContainerStyle={{
          justifyContent: 'center',
          borderWidth: 0,
          padding: 15,
          height: textInputContainerHeight,
          borderRadius: 5,
        }}
        style={{
          height: (textInputContainerHeight * 0.7),
          flex: 1,
        }}
        country={ this.props.country }
        placeholder={ i18n.t('ENTER_NEW_ADDRESS') }
        location={ this.props.location }
        onChangeText={ (text) => this.setState({focused: text.length >= 3}) }
        onSelectAddress={ (address) => {
          this.props.navigation.navigate('AddressDetails', {address})
        }}
        onBlur={ () => this.setState({focused: false}) }
      />
        {!this.state.focused && <View style={{ flex: 4 }}>
          <Divider/>
          <Heading margin={3}>{ i18n.t('MY_ADDRESSES') }</Heading>
        <FlatList
          keyExtractor={ (item) => item['@id'] }
          data={ addresses }
          refreshing={this.state.refreshing}
          onRefresh={async () => {
            this.setState({refreshing: true})
            await this.props.loadAddresses()
            this.setState({refreshing: false})
          }}
          ItemSeparatorComponent={ ItemSeparator }
          ListEmptyComponent={ <View style={{
            alignItems: 'center',
            padding: 10,
          }}>
            <Image style={{ width: '40%', margin: 'auto' }} source={require('../../assets/images/no_addresses.png')} resizeMode={'contain'} />
            <Heading width={'90%'}>Bla bla bla addresses</Heading>
            <Text width={'80%'} color={darkGreyColor}>tru truc</Text>
            <Button borderRadius={100} onPress={() => this.props.navigation.navigate('Home')} backgroundColor={primaryColor} margin={8}>Ajouter une adress</Button>
          </View>}
          renderItem={ this._renderRow.bind(this) }
        />
      </View>}
      </View>
    );
  }
}

AccountAddressesPage.propTypes = {
  onSelect: PropTypes.func,
}

function mapStateToProps(state) {

  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    addresses: state.account.addresses,
    address: state.checkout.address,
  }
}

function mapDispatchToProps(dispatch, ownProps) {

  const fnSelect = (address) => {
    if (ownProps.route.params?.onSelect instanceof Function) {
      return ownProps.route.params.onSelect(address)
    } else {
      dispatch(_setAddress(address))
    }
  }
  return {
    loadAddresses: () => dispatch(loadAddresses()),
    newAddress: address => dispatch(newAddress(address)),
    setAddress: address => fnSelect(address),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountAddressesPage))
