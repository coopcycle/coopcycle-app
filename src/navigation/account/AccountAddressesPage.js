import React, { Component } from 'react';
import { FlatList, InteractionManager, View } from 'react-native';
import {
  Box, Text,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { loadAddresses } from '../../redux/Account/actions'
import ItemSeparator from '../../components/ItemSeparator'

class AccountAddressesPage extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadAddresses()
    })
  }

  _renderRow({ item }) {
    return (
      <Box px="2" py="3">
        <Text>{ item.streetAddress }</Text>
      </Box>
    );
  }

  render() {

    const { addresses } = this.props

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={ (item) => item['@id'] }
          data={ addresses }
          ItemSeparatorComponent={ ItemSeparator }
          renderItem={ this._renderRow.bind(this) }
        />
      </View>
    );
  }
}

function mapStateToProps(state) {

  return {
    addresses: state.account.addresses,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    loadAddresses: () => dispatch(loadAddresses()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountAddressesPage))
