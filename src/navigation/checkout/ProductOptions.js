import React, { Component } from 'react'
import { SectionList, TouchableOpacity, View, StyleSheet, useColorScheme } from 'react-native'
import { Flex, Badge, Icon, Text, Heading, Box, VStack } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { formatPrice } from '../../utils/formatting'
import ProductOptionsBuilder from '../../utils/ProductOptionsBuilder'
import ItemSeparator from '../../components/ItemSeparator'

const SimpleOption = ({ name, price, onPress, selected, index, sectionIndex }) => {

  return (
    <TouchableOpacity style={ styles.item } onPress={ onPress }
      testID={ `productOptions:${sectionIndex}:${index}` }>
      <View style={{ width: '66.6666%', justifyContent: 'space-between', padding: 15 }}>
        <Text>{ name }</Text>
        { price > 0 ? (<Text note>{ `${formatPrice(price)}` }</Text>) : null }
      </View>
      <View style={{ width: '33.3333%' }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 15 }}>
          { selected && <Icon as={ FontAwesome } name="check-square" /> }
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
      { price > 0 ? (<Text note>{ `${formatPrice(price)}` }</Text>) : null }
    </TouchableOpacity>
    <View style={{ width: '33.3333%' }}>
      <View
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={ onPressDecrement }>
          <Icon as={ FontAwesome } name="minus-circle" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={ onPressIncrement }>
          <Icon as={ FontAwesome } name="plus-circle" />
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

const SectionHeader = ({ children }) => {

  const colorScheme = useColorScheme()

  return (
    <Box p="3" bg={ colorScheme === 'dark' ? 'black' : 'white' }>
      { children }
    </Box>
  )
}

class ProductOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      payload: [],
      isValid: false,
    }
    this.list = React.createRef()

    const product = props.product
    this.optionsBuilder = new ProductOptionsBuilder(product && product.menuAddOn)
  }

  componentDidMount() {
    const product = this.props.product
    this.optionsBuilder = new ProductOptionsBuilder(product.menuAddOn)
    this.props.onChanges({
      optionsPayload: this.optionsBuilder.getPayload(),
      optionsAreValid: this.optionsBuilder.isValid(),
    });
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
    this.props.onChanges({
      optionsPayload: this.state.payload,
      optionsAreValid: this.state.isValid,
    });
  }

  _getSectionIndex(section) {

    const product = this.props.product

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

    if (min && max) {
      return (
        <Text sub>
          { this.props.t('CHECKOUT_PRODUCT_OPTIONS_CHOICES_BETWEEN', { min, max }) }
        </Text>
      )
    }

  }

  renderSectionHeader(menuSection) {

    return (
      <SectionHeader>
        <Flex direction="row" alignItems="center">
          <Heading size="sm" >{ menuSection.name }</Heading>
          { !menuSection.additional &&
            <Text sub ml={1}>
              ({ this.props.t('OPTION_REQUIRED') })
            </Text>
          }
        </Flex>
        { menuSection.valuesRange && this.renderSectionHelp(menuSection) }
      </SectionHeader>
    )
  }

  render() {

    const product = this.props.product;

    const sections = product.menuAddOn.map((menuSection, index) => ({
      ...menuSection,
      data: menuSection.hasMenuItem,
      index,
    }))

    const someSectionIsMandatory = sections.some((section) => !section.additional)

    return (
      <VStack flex={ 1 }>
        <Box p="3">
          <Heading size="md">
            { this.props.t('CHECKOUT_PRODUCT_OPTIONS_TITLE') }
          </Heading>
          { someSectionIsMandatory &&
            <Text sub>
              { this.props.t('SOME_OPTION_IS_REQUIRED_SELECT_ONE_VALUE') }
            </Text>
          }
        </Box>
        <SectionList
          ref={ this.list }
          sections={ sections }
          renderItem={ ({ item, section, index }) => this.renderItem(item, section, index) }
          renderSectionHeader={ ({ section }) => this.renderSectionHeader(section) }
          keyExtractor={ (item, index) => index }
          ItemSeparatorComponent={ ItemSeparator }
          stickySectionHeadersEnabled={ true }
        />
      </VStack>
    )
  }
}

const styles = StyleSheet.create({
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

export default connect(mapStateToProps)(withTranslation()(ProductOptions))
