import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Container, Header, Content, ListItem, Text, Radio, Right, Left, Footer, FooterTab, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'

import { addItem } from '../../redux/Checkout/actions'
import Modal from '../restaurant/components/Modal'

class ProductOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // Store options in a hash, indexed per section
      options: {}
    }
  }

  _enableAddToCartButton() {
    const { product } = this.props.navigation.state.params
    const { options } = this.state

    const optionsKeys = _.keys(options)

    return optionsKeys.length === product.menuAddOn.length
  }

  _onPressItem(menuSection, menuItem) {
    const { options } = this.state

    const newOptions = {
      ...options,
      [ menuSection.identifier ]: menuItem.identifier
    }

    this.setState({ options: newOptions })
  }

  _onPressAddToCart() {
    const { product } = this.props.navigation.state.params
    const { options } = this.state

    const optionsValues = _.values(options);

    const optionsArray = []
    _.forEach(product.menuAddOn, menuSection => {
      const optionItem = _.find(menuSection.hasMenuItem, item => _.includes(optionsValues, item.identifier))
      if (optionItem) {
        optionsArray.push(optionItem)
      }
    })

    this.props.addItem(product, optionsArray)
    this.props.navigation.goBack()
  }

  renderFooter() {
    if (this._enableAddToCartButton()) {
      return (
        <Footer>
          <FooterTab>
            <Button full onPress={ () => this._onPressAddToCart() }>
              <Text>{ this.props.t('ADD_TO_CART') }</Text>
            </Button>
          </FooterTab>
        </Footer>
      )
    }
  }

  renderItem(menuSection, menuItem) {

    const { options } = this.state

    let selected = options.hasOwnProperty(menuSection.identifier) && options[menuSection.identifier] === menuItem.identifier

    return (
      <ListItem key={ menuItem.identifier } onPress={ () => this._onPressItem(menuSection, menuItem) }>
        <Left>
          <Text>{ menuItem.name }</Text>
        </Left>
        <Right>
          <Radio selected={ selected } />
        </Right>
      </ListItem>
    )
  }

  renderSection(menuSection) {
    return (
      <View key={ menuSection.identifier }>
        <ListItem itemDivider>
          <Text>{ menuSection.name }</Text>
        </ListItem>
        { menuSection.hasMenuItem.map(menuItem => this.renderItem(menuSection, menuItem)) }
      </View>
    )
  }

  render() {

    const { product } = this.props.navigation.state.params

    return (
      <Modal
        navigation={ this.props.navigation }
        title={ this.props.t('CHECKOUT_PRODUCT_OPTIONS_TITLE') }>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('CHECKOUT_PRODUCT_OPTIONS_DISCLAIMER', { name: product.name }) }
          </Text>
        </View>
        <Content>
          { product.menuAddOn.map(menuSection => this.renderSection(menuSection)) }
        </Content>
        { this.renderFooter() }
      </Modal>
    )
  }
}

const styles = StyleSheet.create({

})

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    addItem: (item, options) => dispatch(addItem(item, options)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(ProductOptions))
