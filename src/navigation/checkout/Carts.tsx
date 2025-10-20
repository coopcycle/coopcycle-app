import _ from 'lodash';
import { Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Icon, ChevronRightIcon, CloseIcon } from '@/components/ui/icon';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Animated, Dimensions, FlatList, Image, View, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
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

function RightAction({ translation, onPress }) {

  const styleAnimation = useAnimatedStyle(() => {

    return {
      transform: [{ translateX: translation.value + 80 }],
    };
  });

  return (
    <Reanimated.View style={[{ width: 80 }, styleAnimation]}>
      <Pressable className="px-4 bg-error-400 flex-1 w-full items-center justify-center" onPress={ onPress }>
        <Icon as={CloseIcon} />
      </Pressable>
    </Reanimated.View>
  );
}

class Carts extends Component {

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
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderRightActions={(progress, translation) => (
          <RightAction
            translation={ translation }
            onPress={ () => this.props.deleteCart(item.restaurant['@id']) } />
        )}>
        <TouchableOpacity
          onPress={() => {
            this.props.setRestaurant(item.restaurant['@id']);
            this.props.navigation.navigate('CheckoutSummary', {
              cart: item.cart,
              restaurant: item.restaurant,
            });
          }}>
          <HStack space="md" className="flex-1 p-3 items-center justify-between">
            <Avatar size="lg">
              <AvatarImage
                source={{ uri: item.restaurant.image }}
              />
            </Avatar>
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
            <View>
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
