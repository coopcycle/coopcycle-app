import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import {
  Container,
  Content, List, ListItem, Text,
} from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { loadAddresses } from '../../redux/Account/actions'

class AccountAddressesPage extends Component {

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.loadAddresses()
    })
  }

  _renderRow(item) {
    return (
      <ListItem>
        <Text>{ item.streetAddress }</Text>
      </ListItem>
    );
  }

  render() {

    const { addresses } = this.props

    return (
      <Container>
        <Content>
          <List dataArray={ addresses } renderRow={ this._renderRow.bind(this) } />
        </Content>
      </Container>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AccountAddressesPage))
