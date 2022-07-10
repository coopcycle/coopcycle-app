import React, { Component } from 'react'
import { Box, Divider, Flex, Heading, Icon, Image, Pressable, ScrollView, Text, VStack } from 'native-base'
import { View } from 'react-native'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import _ from 'lodash'
import ProductOptions from './ProductOptions'
import FooterButton from './components/FooterButton'
import { addItem } from '../../redux/Checkout/actions'
import { formatPrice } from '../../utils/formatting'
import { AllergenList, RestrictedDietList } from '../../components/MenuBadges'

class ProductDetails extends Component {

    constructor(props) {
        super(props)
        const product = props.route.params?.product;
        this.state = {
            quantity: 1,
            optionsPayload: [],
            shouldRenderOptions: product.hasOwnProperty('menuAddOn') && Array.isArray(product.menuAddOn) && product.menuAddOn.length > 0,
            optionsAreValid: false,
        }
    }

    _incrementQuantity() {
        this.setState({
            quantity: this.state.quantity + 1,
        })
    }

    _decrementQuantity() {
        this.setState({
            quantity: this.state.quantity - 1,
        })
    }

    _onPressAddToCart() {
        const product = this.props.route.params?.product;
        const restaurant = this.props.route.params?.restaurant;

        this.props.addItem(restaurant, product, this.state.quantity, this.state.optionsPayload);
        this.props.navigation.navigate('CheckoutRestaurant', { restaurant });
    }

    optionsHasChanged({ optionsPayload, optionsAreValid }) {
        this.setState({ optionsPayload, optionsAreValid });
    }

    _calculateTotalPrice() {
        const product = this.props.route.params?.product;
        let total = product.offers.price;

        if (this.state.optionsPayload.length) {
            const optionsTotal = this.state.optionsPayload.reduce((acc, option) => {
                return acc + (option.price * option.quantity);
            }, 0);
            total += optionsTotal;
        }

        total *= this.state.quantity;

        return total;
    }

    renderFooter() {
        if (!this.state.shouldRenderOptions || this.state.optionsAreValid) {
            const totalPrice = this._calculateTotalPrice();
            return (
                <FooterButton
                    testID="addProduct"
                    text={ `${this.props.t('ADD_TO_CART')} ${formatPrice(totalPrice)}` }
                    onPress={ () => this._onPressAddToCart() } />
            )
        }
    }

    render() {
        const product = this.props.route.params?.product;
        const hasBadges = !!product.suitableForDiet || !!product.allergens;

        const image16x9 = product.images && Array.isArray(product.images)
            && _.find(product.images, image => image.ratio === '16:9')

        return (
            <VStack flex={ 1 }>
                { image16x9 &&
                <Image size="md" style={{ width: '100%' }} resizeMode="cover" source={{ uri: image16x9.url }} alt="Product" />
                }
                <Box p="3">
                    <Heading size="lg">
                        { product.name }
                    </Heading>
                    {product.description && product.description.length > 0 &&
                    <View style={{ maxHeight: 90 }}>
                        <ScrollView>
                            <Text mt="2">{ product.description }</Text>
                        </ScrollView>
                    </View>
                    }
                    { hasBadges && (
                    <Box mt="2">
                        { product.suitableForDiet && (<RestrictedDietList items={ product.suitableForDiet } />) }
                        { product.allergens && (<AllergenList items={ product.allergens } />) }
                    </Box>
                    ) }
                    <Text mt="2" bold fontSize="xl">{ `${formatPrice(product.offers.price)}` }</Text>
                </Box>
                <Divider my="2" />
                <Flex flexDirection="row" px="3" py="1" align="center" justify="space-between">
                    <Heading size="md">{ this.props.t('CHECKOUT_UNITS') }</Heading>
                    <Flex flexDirection="row" align="center">
                        <Pressable disabled={this.state.quantity <= 1} p="2" onPress={ () => { this._decrementQuantity() } }>
                            <Icon as={ FontAwesome } style={{ opacity: this.state.quantity <= 1 ? 0.5 : 1 }} name="minus-circle" size="sm" />
                        </Pressable>
                        <Text mx="2" bold>{ this.state.quantity }</Text>
                        <Pressable p="2" onPress={ () => { this._incrementQuantity() } }>
                            <Icon as={ FontAwesome } style={{ opacity: 1 }} name="plus-circle" size="sm" />
                        </Pressable>
                    </Flex>
                </Flex>
                <Divider my="2" />
                {this.state.shouldRenderOptions &&
                <ProductOptions product={product} onChanges={(changes) => this.optionsHasChanged(changes)}/>
                }
                { this.renderFooter() }
            </VStack>
        )
    }

}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        addItem: (restaurant, item, quantity, options) => dispatch(addItem(restaurant, item, quantity, options)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(ProductDetails))
