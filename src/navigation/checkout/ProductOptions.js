import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Container, Header, Content, ListItem, Text, Radio, Right, Left, Footer, FooterTab, Button } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'

import { addItem } from '../../redux/Checkout/actions'
import { formatPrice } from '../../Cart'

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

    for (let i = 0; i < product.menuAddOn.length; i++) {
      let menuSection = product.menuAddOn[i]
      if (!menuSection.additional && !options.hasOwnProperty(menuSection.identifier)) {
        return false
      }
    }

    return true
  }

  _onPressItem(menuSection, menuItem) {
    const { options } = this.state

    let newOptions = {
      ...options,
    }

    if (menuSection.additional) {

      let choices = []

      if (newOptions.hasOwnProperty(menuSection.identifier)) {
        choices = newOptions[menuSection.identifier]
      }

      if (_.includes(choices, menuItem.identifier)) {
        choices = _.filter(choices, choice => choice !== menuItem.identifier)
      } else {
        choices.push(menuItem.identifier)
      }

      newOptions = {
        ...newOptions,
        [ menuSection.identifier ]: choices
      }
    } else {
      newOptions = {
        ...newOptions,
        [ menuSection.identifier ]: menuItem.identifier
      }
    }

    this.setState({ options: newOptions })
  }

  _onPressAddToCart() {
    const { product } = this.props.navigation.state.params
    const { options } = this.state

    const optionsValues = _.flatten(_.values(options))

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

    let selected = false

    if (options.hasOwnProperty(menuSection.identifier)) {
      if (Array.isArray(options[menuSection.identifier])) {
        selected = _.includes(options[menuSection.identifier], menuItem.identifier)
      } else {
        selected = options[menuSection.identifier] === menuItem.identifier
      }
    }

    let price = 0
    if (menuItem.hasOwnProperty('offers')) {
      price = menuItem.offers.price
    }

    return (
      <ListItem key={ menuItem.identifier } onPress={ () => this._onPressItem(menuSection, menuItem) }>
        <Left style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text>{ menuItem.name }</Text>
          { price > 0 && (<Text note>{ `${formatPrice(price)} €` }</Text>) }
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
      <Container>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('CHECKOUT_PRODUCT_OPTIONS_DISCLAIMER', { name: product.name }) }
          </Text>
        </View>
        <Content>
          { product.menuAddOn.map(menuSection => this.renderSection(menuSection)) }
        </Content>
        { this.renderFooter() }
      </Container>
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

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(ProductOptions))
