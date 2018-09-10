import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Container, Header, Content, Text, Radio, Right, Left, Footer, FooterTab, Button, Icon } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'

import { incrementItem, decrementItem } from '../../redux/Checkout/actions'
import Modal from '../restaurant/components/Modal'

class EditItem extends Component {

  componentDidUpdate(prevProps, prevState) {
    if (this.props.item.quantity === 0) {
      this.props.navigation.goBack()
    }
  }

  render() {

    const { item } = this.props

    return (
      <Modal
        navigation={ this.props.navigation }
        title={ this.props.t('CHANGE_QUANT') }>
        <Content padder>
          <Grid>
            <Row>
              <Col>
                <View style={ styles.decrement }>
                  <Button bordered rounded onPress={ () => this.props.decrementItem(item) }>
                    <Icon name="remove" />
                  </Button>
                </View>
              </Col>
              <Col>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text>{ item.quantity }</Text>
                </View>
              </Col>
              <Col>
                <View style={ styles.increment }>
                  <Button bordered rounded onPress={ () => this.props.incrementItem(item) }>
                    <Icon name="add" />
                  </Button>
                </View>
              </Col>
            </Row>
          </Grid>
        </Content>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  decrement: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  increment: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  }
});

function mapStateToProps(state, ownProps) {

  const cart = state.checkout.cart

  const item = _.find(cart.items, item =>
    item.menuItem.identifier == ownProps.navigation.state.params.item.menuItem.identifier)

  // FIXME Doesn't work
  // const item = _.find(cart.items, item => item.matches(ownProps.navigation.state.params.item))

  return {
    item: item.clone()
  }
}

function mapDispatchToProps(dispatch) {
  return {
    incrementItem: item => dispatch(incrementItem(item)),
    decrementItem: item => dispatch(decrementItem(item)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(EditItem))
