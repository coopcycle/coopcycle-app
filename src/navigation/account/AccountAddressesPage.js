import React, { Component } from 'react';
import { InteractionManager, View, FlatList } from 'react-native';
import {
  Text,
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
      <View style={{ paddingVertical: 15, paddingHorizontal: 10 }}>
        <Text>{ item.streetAddress }</Text>
      </View>
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
