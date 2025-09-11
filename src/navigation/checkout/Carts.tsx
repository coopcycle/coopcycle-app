import _ from 'lodash';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Icon, ChevronRightIcon, TrashIcon } from '@/components/ui/icon';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Animated, Dimensions, FlatList, Image, View } from 'react-native';
import {
  RectButton,
  Swipeable,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import i18n from '../../i18n';
import { deleteCart, setRestaurant } from '../../redux/Checkout/actions';
import { selectCarts } from '../../redux/Checkout/selectors';
import { greyColor, primaryColor } from '../../styles/common';
import { useSecondaryTextColor } from '../../styles/theme';
import { formatPrice } from '../../utils/formatting';

const AnimatedView = Animated.createAnimatedComponent(View);
const { width } = Dimensions.get('window');

class Carts extends Component {
  renderRightActions = (progress, dragX, restaurantID) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });
    //FIXME: Close Swipeable on delete
    return (
      <AnimatedView style={{ ...styles.animatedView, transform: [{ scale }] }}>
        <RectButton
          style={styles.deleteButton}
          onPress={() => this.props.deleteCart(restaurantID)}>
          <Icon
            as={TrashIcon}
            size="sm"
            style={{ color: '#ff0000' }}
          />
        </RectButton>
      </AnimatedView>
    );
  };

  emptyList = () => (
    <View
      style={{
        alignItems: 'center',
        padding: 10,
      }}>
      <Image
        style={{
          maxWidth: '40%',
          maxHeight: '30%',
          marginVertical: '10%',
          margin: 'auto',
        }}
        source={require('../../assets/images/empty_cart.png')}
        resizeMode={'contain'}
      />
      <Heading>{this.props.t('EMPTY_CARTS_TITLE')}</Heading>
      <Text
        color={this.props.secondaryTextColor}>
        {this.props.t('EMPTY_CARTS_SUBTITLE')}
      </Text>
      <Button
        onPress={() => this.props.navigation.navigate('Home')}>
        <ButtonText>{this.props.t('GO_TO_SHOPPING')}</ButtonText>
      </Button>
    </View>
  );

  _renderItem = (item, index) => (
    <>
      <Swipeable
        enabled={!item?.softDelete}
        renderRightActions={(progress, dragX) =>
          this.renderRightActions(progress, dragX, item.restaurant['@id'])
        }>
        <TouchableOpacity
          disabled={item?.softDelete}
          onPress={() => {
            this.props.setRestaurant(item.restaurant['@id']);
            this.props.navigation.navigate('CheckoutSummary', {
              cart: item.cart,
              restaurant: item.restaurant,
            });
          }}>
          <HStack space="md" className="p-2 items-center">
            <Skeleton
              className="w-1/5"
              isLoaded={!item?.softDelete}>
              <Avatar size="lg">
                <AvatarImage
                  source={{ uri: item.restaurant.image }}
                />
              </Avatar>
            </Skeleton>
            <SkeletonText
                _lines={4}
                className="h-2"
                isLoaded={!item?.softDelete}>
              <VStack>
                <Text bold>{item.restaurant.name}</Text>
                <Text color={this.props.secondaryTextColor}>
                  {i18n.t('ITEM', { count: item.cart.items.length })} •{' '}
                  {formatPrice(item.cart.total)}
                </Text>
                <Text
                  numberOfLines={1}
                  maxWidth={width - 170}
                  color={this.props.secondaryTextColor}>
                  {item.cart.shippingAddress?.streetAddress}
                </Text>
              </VStack>
            </SkeletonText>
            <View
              style={{
                flexGrow: 1,
                justifyContent: 'center',
                alignItems: 'flex-end',
              }}>
              <Icon as={ChevronRightIcon} />
            </View>
          </HStack>
        </TouchableOpacity>
      </Swipeable>
    </>
  );

  render() {
    return (
      <FlatList
        data={_.values(this.props.carts)}
        alwaysBounceVertical={false}
        keyExtractor={(item, index) => index}
        renderItem={({ item, index }) => this._renderItem(item, index)}
        ListEmptyComponent={this.emptyList}
      />
    );
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
};

function mapStateToProps(state) {
  return {
    carts: selectCarts(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setRestaurant: id => dispatch(setRestaurant(id)),
    deleteCart: id => dispatch(deleteCart(id)),
  };
}

function withHooks(ClassComponent) {
  return function CompWithHook(props) {
    const secondaryTextColor = useSecondaryTextColor();
    return (
      <ClassComponent {...props} secondaryTextColor={secondaryTextColor} />
    );
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(withHooks(Carts)));
