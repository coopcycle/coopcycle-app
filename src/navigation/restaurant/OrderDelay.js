import React, { Component } from 'react'
import { View } from 'react-native'
import { Container, Content, Text } from 'native-base'
import { Row, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import BigButton from './components/BigButton'
import { delayOrder } from '../../redux/Restaurant/actions'

class OrderDelayScreen extends Component {

  _delayOrder(delay) {
    this.props.delayOrder(
      this.props.navigation.getParam('order'),
      delay,
      order => this.props.navigation.navigate('RestaurantOrder', { order })
    )
  }

  render() {
    return (
      <Container
        navigation={ this.props.navigation }
        title={ this.props.t('RESTAURANT_ORDER_DELAY_MODAL_TITLE') }>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('RESTAURANT_ORDER_DELAY_DISCLAIMER') }
          </Text>
        </View>
        <Content>
          <Grid style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20 }}>
            <Row style={{ marginBottom: 20 }}>
              <BigButton
                heading={ '10 minutes' }
                onPress={ () => this._delayOrder(10) } />
            </Row>
            <Row style={{ marginBottom: 20 }}>
              <BigButton
                heading={ '20 minutes' }
                onPress={ () => this._delayOrder(20) } />
            </Row>
            <Row>
              <BigButton danger
                heading={ '30 minutes' }
                onPress={ () => this._delayOrder(30) } />
            </Row>
          </Grid>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {

  return {}
}

function mapDispatchToProps(dispatch) {

  return {
    delayOrder: (order, delay, cb) => dispatch(delayOrder(order, delay, cb)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderDelayScreen))
