import React, { Component } from 'react'
import { SectionList, View } from 'react-native'
import { Container, Content, ListItem, Text, Radio, Right, Left, Footer, FooterTab, Button } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import _ from 'lodash'

import { addItemWithOptions } from '../../redux/Checkout/actions'
import { formatPrice } from '../../utils/formatting'

class ProductOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // Store options in a hash, indexed per section
      options: {},
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
        [ menuSection.identifier ]: choices,
      }
    } else {
      newOptions = {
        ...newOptions,
        [ menuSection.identifier ]: menuItem.identifier,
      }
    }

    this.setState({ options: newOptions })
  }

  _onPressAddToCart() {
    const { product } = this.props.navigation.state.params
    const { options } = this.state

    const optionsValues = _.flatten(_.values(options))

    let allOptions = []
    if (product.hasOwnProperty('menuAddOn')) {
      _.forEach(product.menuAddOn, (menuSection) => {
        allOptions = allOptions.concat(menuSection.hasMenuItem)
      })
    }

    const optionsArray = []
    _.forEach(optionsValues, (value) => {
      const optionItem = _.find(allOptions, item => item.identifier === value)
      if (optionItem) {
        optionsArray.push(optionItem)
      }
    })

    this.props.addItem(product, optionsArray)
    this.props.navigation.navigate('CheckoutRestaurant', { restaurant: this.props.restaurant })
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

  renderItem(menuItem, menuSection) {

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
          { price > 0 ? (<Text note>{ `${formatPrice(price)} €` }</Text>) : null }
        </Left>
        <Right>
          <Radio selected={ selected } />
        </Right>
      </ListItem>
    )
  }

  renderSection(menuSection) {
    return (
      <View>
        <ListItem itemDivider>
          <Text>{ menuSection.name }</Text>
        </ListItem>
      </View>
    )
  }

  render() {

    const { product } = this.props.navigation.state.params

    let sections = []
    _.forEach(product.menuAddOn, (menuSection) => {
      sections.push({
        identifier: menuSection.identifier,
        name: menuSection.name,
        data: menuSection.hasMenuItem,
      })
    })

    return (
      <Container>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('CHECKOUT_PRODUCT_OPTIONS_DISCLAIMER', { name: product.name }) }
          </Text>
        </View>
        <SectionList
          sections={ sections }
          renderItem={ ({ item, section }) => this.renderItem(item, section) }
          renderSectionHeader={ ({ section }) => this.renderSection(section) }
          keyExtractor={ (item, index) => index }
        />
        { this.renderFooter() }
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    restaurant: state.checkout.restaurant,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addItem: (item, options) => dispatch(addItemWithOptions(item, options)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductOptions))
