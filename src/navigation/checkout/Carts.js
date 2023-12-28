import React, { Component } from 'react'
import { Animated, Dimensions, FlatList, Image } from 'react-native'
import { Avatar, Box, Button, ChevronRightIcon, HStack, Heading, Icon, Skeleton, Text, VStack, View } from 'native-base'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Spacer } from 'native-base/src/components/primitives/Flex';
import { greyColor, primaryColor } from '../../styles/common';
import { RectButton, Swipeable, TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../../i18n';
import _ from 'lodash'
import { formatPrice } from '../../utils/formatting';
import { deleteCart, setRestaurant } from '../../redux/Checkout/actions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { selectCarts } from '../../redux/Checkout/selectors';
import { useSecondaryTextColor } from '../../styles/theme'

const AnimatedView = Animated.createAnimatedComponent(View);
const { width } = Dimensions.get('window')

class Carts extends Component {

  renderRightActions = (progress, dragX, restaurantID) => {
    const scale = dragX.interpolate({
      inputRange: [ -80, 0 ],
      outputRange: [ 1, 0 ],
      extrapolate: 'clamp',
    });
    //FIXME: Close Swipeable on delete
    return (
      <AnimatedView style={{ ...styles.animatedView, transform: [{ scale }] }}>
      <RectButton style={ styles.deleteButton } onPress={() => this.props.deleteCart(restaurantID)}>
          <Icon as={Ionicons} name="trash" size={5} style={{ color: '#ff0000' }} />
      </RectButton>
      </AnimatedView>
    );
  };

  emptyList = () => <View style={{
      alignItems: 'center',
      padding: 10,
    }}>
      <Image style={{ maxWidth: '40%', maxHeight: '30%', marginVertical: '10%', margin: 'auto' }} source={require('../../assets/images/empty_cart.png')} resizeMode={'contain'} />
      <Heading>{this.props.t('EMPTY_CARTS_TITLE')}</Heading>
      <Text style={{ textAlign: 'center' }} color={this.props.secondaryTextColor}>{this.props.t('EMPTY_CARTS_SUBTITLE')}</Text>
      <Button borderRadius={100} onPress={() => this.props.navigation.navigate('Home')} backgroundColor={primaryColor} margin={8}>{this.props.t('GO_TO_SHOPPING')}</Button>
    </View>

  _renderItem = (item, index) =>
    <><Swipeable enabled={!item?.softDelete}
      renderRightActions={(progress, dragX) => this.renderRightActions(progress, dragX, item.restaurant['@id'])}
    ><TouchableOpacity disabled={item?.softDelete} onPress={() => {
      this.props.setRestaurant(item.restaurant['@id'])
      this.props.navigation.navigate('CheckoutSummary', { cart: item.cart, restaurant: item.restaurant })
    } }>
        <HStack space={4} padding={2}>
        <Skeleton width="64px" borderRadius="full" isLoaded={!item?.softDelete}>
          <Avatar size="lg" resizeMode="contain" borderRadius="full" source={{ uri: item.restaurant.image }} alt={item.restaurant.name} />
        </Skeleton>
        <VStack>
          <Skeleton.Text noOfLines={3} lineHeight={4} isLoaded={!item?.softDelete}>
            <Text bold>{item.restaurant.name}</Text>
            <Text color={this.props.secondaryTextColor}>{i18n.t('ITEM', { count: item.cart.items.length })} • {formatPrice(item.cart.total)}</Text>
            <Text noOfLines={1} maxWidth={width - 170} color={this.props.secondaryTextColor}>{item.cart.shippingAddress?.streetAddress}</Text>
          </Skeleton.Text>
        </VStack>
        <Spacer/>
          <View style={{ flexGrow: 1, justifyContent:'center', alignItems: 'flex-end' }}>
          <ChevronRightIcon />
          </View>
        </HStack>
      </TouchableOpacity></Swipeable>
      <Box marginLeft={20} marginRight={5} borderBottomWidth={1} borderColor={greyColor} />
    </>

  render() {
    return <FlatList
      data={_.values(this.props.carts)}
      alwaysBounceVertical={false}
      keyExtractor={(item, index) => index}
      renderItem={({ item, index }) => this._renderItem(item, index) }
      ListEmptyComponent={this.emptyList} />
  }
}

const styles = {
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#ffb7b7',
    borderRadius: 50,
  },
  animatedView: {
    justifyContent: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
}

function mapStateToProps(state) {

  return {
    carts: selectCarts(state),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setRestaurant: id => dispatch(setRestaurant(id)),
    deleteCart: id => dispatch(deleteCart(id)),
  }
}

function withHooks(ClassComponent) {
  return function CompWithHook(props) {
    const secondaryTextColor = useSecondaryTextColor()
    return <ClassComponent {...props} secondaryTextColor={secondaryTextColor} />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withHooks(Carts)))
