import React, { Component } from 'react'
import { View } from 'react-native'
import { Container } from 'native-base';
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import DeliveryList from '../../components/DeliveryList'

import variables from '../../../native-base-theme/variables/platform'

class StoreDashboard extends Component {

  componentDidMount() {
    // This is needed to display the title
    this.props.navigation.setParams({ store: this.props.store })
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <View style={{ flex: 1, flexDirection: 'column', marginBottom: variables.isIphoneX ? 88 : 0 }}>
          <DeliveryList
            onItemPress={ item => navigate('StoreDelivery', { delivery: item }) } />
        </View>
      </Container>
    )
  }
}

function mapStateToProps(state) {

  return {
    store: state.store.store,
  }
}

export default connect(mapStateToProps)(withTranslation()(StoreDashboard))
