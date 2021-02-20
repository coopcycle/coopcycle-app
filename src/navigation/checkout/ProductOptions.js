import React, { Component } from 'react'
import { SectionList, TouchableOpacity, View, StyleSheet } from 'react-native'
import { Badge, Container, Icon, ListItem, Text, Radio } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { addItemWithOptions } from '../../redux/Checkout/actions'
import { formatPrice } from '../../utils/formatting'
import ProductOptionsBuilder from '../../utils/ProductOptionsBuilder'
import FooterButton from './components/FooterButton'

const ItemSeparatorComponent = () => (
  <View style={ styles.itemSeparator } />
)

const SimpleOption = ({ name, price, onPress, selected, index, sectionIndex }) => {

  return (
    <TouchableOpacity style={ styles.item } onPress={ onPress }
      testID={ `productOptions:${sectionIndex}:${index}` }>
      <View style={{ width: '66.6666%', justifyContent: 'space-between', padding: 15 }}>
        <Text>{ name }</Text>
        { price > 0 ? (<Text note>{ `${formatPrice(price)}` }</Text>) : null }
      </View>
      <View style={{ width: '33.3333%' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 15 }}>
          <Radio selected={ selected } />
        </View>
      </View>
    </TouchableOpacity>
  )
}

const RangeOption = ({ name, price, onPress, selected, onPressIncrement, onPressDecrement, quantity }) => (
  <View style={ styles.item }>
    <TouchableOpacity style={{ width: '66.6666%', justifyContent: 'space-between', padding: 15 }}
      onPress={ onPress }>
      <Text>{ name }</Text>
      { price > 0 ? (<Text note>{ `${formatPrice(price)}` }</Text>) : null }
    </TouchableOpacity>
    <View style={{ width: '33.3333%' }}>
      <View
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={ onPressIncrement }>
          <Icon type="FontAwesome" name="plus-circle" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={ onPressDecrement }>
          <Icon type="FontAwesome" name="minus-circle" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Badge info style={{ alignSelf: 'center' }}>
            <Text>{ quantity }</Text>
          </Badge>
        </View>
      </View>
    </View>
  </View>
)

class ProductOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      payload: [],
      isValid: false,
    }
    this.list = React.createRef()

    const product = props.navigation.getParam('product')
    this.optionsBuilder = new ProductOptionsBuilder(product && product.menuAddOn)
  }

  componentDidMount() {
    const product = this.props.navigation.getParam('product')
    this.optionsBuilder = new ProductOptionsBuilder(product.menuAddOn)
  }

  _gotoNextOption() {
    const nextOption = this.optionsBuilder.getFirstInvalidOption()
    if (nextOption) {
      const sectionIndex = this._getSectionIndex(nextOption)
      if (sectionIndex !== -1) {
        this.list.current.scrollToLocation({
          sectionIndex,
          itemIndex: 0,
        })
      }
    }
  }

  _getSectionIndex(section) {

    const product = this.props.navigation.getParam('product')

    for (let i = 0; i < product.menuAddOn.length; i++) {
      let menuSection = product.menuAddOn[i]
      if (menuSection.identifier === section.identifier) {
        return i
      }
    }

    return -1
  }

  _onPressItem(menuSection, menuItem) {

    this.optionsBuilder.add(menuItem)

    this.setState({
      payload: this.optionsBuilder.getPayload(),
      isValid: this.optionsBuilder.isValid(),
    }, () => this._gotoNextOption())
  }

  _onPressAddToCart() {
    const product = this.props.navigation.getParam('product')

    this.props.addItem(product, this.state.payload)
    this.props.navigation.navigate('CheckoutRestaurant', { restaurant: this.props.restaurant })
  }

  _increment(menuItem) {
    this.optionsBuilder.increment(menuItem)

    this.setState({
      payload: this.optionsBuilder.getPayload(),
      isValid: this.optionsBuilder.isValid(),
    }, () => this._gotoNextOption())
  }

  _decrement(menuItem) {
    this.optionsBuilder.decrement(menuItem)

    this.setState({
      payload: this.optionsBuilder.getPayload(),
      isValid: this.optionsBuilder.isValid(),
    }, () => this._gotoNextOption())
  }

  renderFooter() {
    if (this.optionsBuilder.isValid()) {
      return (
        <FooterButton
          testID="addProductWithOptions"
          text={ this.props.t('ADD_TO_CART') }
          onPress={ () => this._onPressAddToCart() } />
      )
    }
  }

  renderItem(menuItem, menuSection, index) {

    const selected = this.optionsBuilder.contains(menuItem)
    const allowsRange = this.optionsBuilder.allowsRange(menuItem)
    const quantity = this.optionsBuilder.getQuantity(menuItem)

    let price = 0
    if (menuItem.hasOwnProperty('offers')) {
      price = menuItem.offers.price
    }

    if (allowsRange) {
      return (
        <RangeOption name={ menuItem.name } price={ price }
          selected={ selected }
          onPress={ () => this._onPressItem(menuSection, menuItem) }
          onPressIncrement={ () => this._increment(menuItem) }
          onPressDecrement={ () => this._decrement(menuItem) }
          quantity={ quantity } />
      )
    }

    return (
      <SimpleOption name={ menuItem.name } price={ price }
        index={ index }
        sectionIndex={ menuSection.index }
        selected={ selected }
        onPress={ () => this._onPressItem(menuSection, menuItem) } />
    )
  }

  renderSectionHelp(menuSection) {
    const [ min, max ] = this.optionsBuilder.parseRange(menuSection.valuesRange)

    return (
      <View style={{ paddingHorizontal: 15, paddingVertical: 5, backgroundColor: '#ffffff' }}>
        <Text style={{ textAlign: 'center' }} note>
          { this.props.t('CHECKOUT_PRODUCT_OPTIONS_CHOICES_BETWEEN', { min, max }) }
        </Text>
      </View>
    )
  }

  renderSection(menuSection) {

    return (
      <View>
        <ListItem itemDivider>
          <Text>{ menuSection.name }</Text>
        </ListItem>
        { menuSection.valuesRange && this.renderSectionHelp(menuSection) }
      </View>
    )
  }

  render() {

    const product = this.props.navigation.getParam('product')

    const sections = product.menuAddOn.map((menuSection, index) => ({
      ...menuSection,
      data: menuSection.hasMenuItem,
      index,
    }))

    return (
      <Container>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('CHECKOUT_PRODUCT_OPTIONS_DISCLAIMER', { name: product.name }) }
          </Text>
        </View>
        <SectionList
          ref={ this.list }
          sections={ sections }
          renderItem={ ({ item, section, index }) => this.renderItem(item, section, index) }
          renderSectionHeader={ ({ section }) => this.renderSection(section) }
          keyExtractor={ (item, index) => index }
          ItemSeparatorComponent={ ItemSeparatorComponent }
        />
        { this.renderFooter() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  itemSeparator: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    backgroundColor: '#cccccc',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
})

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
