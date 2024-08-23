import _ from 'lodash';
import {
  Button,
  Center,
  Checkbox,
  HStack,
  Icon,
  Pressable,
  Text,
} from 'native-base';
import React, { Component } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  FlatList,
  InteractionManager,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect, useDispatch } from 'react-redux';

import DropdownHolder from '../../DropdownHolder';
import BottomModal from '../../components/BottomModal';
import DangerAlert from '../../components/DangerAlert';
import {
  checkTimeRange,
  decrementItem,
  hideAddressModal,
  incrementItem,
  removeItem,
  setAddress,
  setDate,
  setFulfillmentMethod,
  setTip,
  showAddressModal,
  showTimingModal,
  showValidationErrors,
  syncAddressAndValidate,
  updateCart,
  validateOrder,
} from '../../redux/Checkout/actions';
import {
  selectCartFulfillmentMethod,
  selectCartWithHours,
  selectDeliveryTotal,
  selectFulfillmentMethods,
  selectIsValid,
  selectShippingTimeRangeLabel,
  selectViolations,
} from '../../redux/Checkout/selectors';
import { primaryColor } from '../../styles/common';
import { formatPrice } from '../../utils/formatting';
import { getMissingAmount } from '../../utils/loopeat';
import CartFooter from './components/CartFooter';
import CouponModal from './components/CouponModal';
import ExpiredSessionModal from './components/ExpiredSessionModal';
import Loopeat from './components/Loopeat';
import TimingModal from './components/TimingModal';
import Tips from './components/Tips';
import TimeRangeChangedModal from './components/TimeRangeChangedModal';

function EmptyState() {
  const { t } = useTranslation();

  return (
    <Center flex={1}>
      <Text>{t('CART_EMPTY_WARNING')}</Text>
    </Center>
  );
}

function ItemAdjustments({ item, index }) {
  const adjustmentsWithoutTax = _.pickBy(
    item.adjustments,
    (value, key) => key !== 'tax',
  );

  return (
    <View style={{ paddingLeft: 5 }}>
      {_.map(adjustmentsWithoutTax, (adjustments, type) => {
        return _.map(adjustments, (adj, i) => {
          const label = [adj.label];
          if (adj.amount > 0) {
            label.push(formatPrice(adj.amount));
          }

          return (
            <Text color="#757575" key={`item:${index}:adjustments:${i}`}>
              {label.join(' ')}
            </Text>
          );
        });
      })}
    </View>
  );
}

function Item({ item, index, translateXValue }) {
  const dispatch = useDispatch();

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: StyleSheet.hairlineWidth,
      }}
      key={item.key}>
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          paddingHorizontal: 15,
          paddingVertical: 15,
        }}>
        <Text>{`${item.quantity} x ${item.name}`}</Text>
        {_.size(item.adjustments) > 0 && (
          <ItemAdjustments item={item} index={index} />
        )}
        <Text note>{`${formatPrice(item.total)}`}</Text>
      </View>
      <Animated.View
        style={{
          flex: 1,
          flexDirection: 'row',
          transform: [{ translateX: translateXValue }],
        }}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <Pressable
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => dispatch(incrementItem(item))}>
            <Icon as={FontAwesome} name="plus-circle" size="sm" />
          </Pressable>
          <Pressable
            disabled={item.quantity <= 1}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => dispatch(decrementItem(item))}>
            <Icon
              as={FontAwesome}
              name="minus-circle"
              size="sm"
              style={{ opacity: item.quantity <= 1 ? 0.5 : 1 }}
            />
          </Pressable>
        </View>
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => dispatch(removeItem(item))}>
          <Icon as={FontAwesome} name="trash-o" size="sm" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function ActionButton({ isLoading, onPress, iconName, iconColor, children }) {
  const iconProps = iconColor ? { color: iconColor } : {};

  return (
    <Pressable
      style={styles.btnGrey}
      // Disable interaction while loading
      onPress={() => !isLoading && onPress()}>
      <HStack p="3" justifyContent="space-between" alignItems="center">
        <Icon
          as={FontAwesome}
          name={iconName}
          mr="2"
          size="sm"
          flexGrow={1}
          {...iconProps}
        />
        <HStack flex={10}>{children}</HStack>
      </HStack>
    </Pressable>
  );
}

function BottomLine({ label, value }) {
  return (
    <View style={styles.line}>
      <Text style={styles.bottomLineLabel}>{label}</Text>
      <Text style={styles.bottomLineAmount}>{`${formatPrice(value)}`}</Text>
    </View>
  );
}

function Adjustments({ adjustments, type }) {
  return (
    <>
      {_.map(adjustments, (adjustment, index) => (
        <BottomLine
          key={`${type}_${index}`}
          label={adjustment.label}
          value={adjustment.amount}
        />
      ))}
    </>
  );
}

function Footer({ cart, isValid, isLoading, onSubmit }) {
  if (!cart || cart.items.length === 0) {
    return <View />;
  }

  return (
    <CartFooter
      onSubmit={onSubmit}
      cart={cart}
      testID="cartSummarySubmit"
      disabled={isValid !== true || isLoading}
    />
  );
}

function CollectionDisclaimerModal({ isVisible, onSwipeComplete, restaurant }) {
  const { t } = useTranslation();

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={['up', 'down']}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            paddingHorizontal: 20,
            paddingVertical: 30,
          }}>
          <Text fontSize="sm">
            {t('CART_COLLECTION_DISCLAIMER', {
              telephone: restaurant.telephone,
            })}
          </Text>
          <Button style={{ marginTop: 20 }} onPress={onSwipeComplete}>
            {t('CLOSE')}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

class Summary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      translateXValue: new Animated.Value(500),
      isCouponModalVisible: false,
      isCollectionDisclaimerModalVisible: false,
      showTipModal: false,
      isLoading: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.syncAddressAndValidate(this.props.cart);
    });
    this.linkingSubscription = Linking.addEventListener('url', ({ url }) => {
      /**
       * todo: it is also triggered on account activation deeplink before an account is activated,
       * which leads to unnecessary requests
       * Should it be triggered only on specific urls?
       */
      this.props.syncAddressAndValidate(this.props.cart);
    });
  }

  componentWillUnmount() {
    this.linkingSubscription.remove();
  }

  componentDidUpdate(prevProps) {
    if (this.props.edit !== prevProps.edit) {
      Animated.timing(this.state.translateXValue, {
        toValue: this.props.edit ? 0 : 500,
        duration: 450,
        useNativeDriver: false,
      }).start();
    }
  }

  _navigate(routeName) {
    // Set edit = false before navigating
    this.props.navigation.setParams({ edit: false });
    this.props.navigation.navigate(routeName);
  }

  async onSubmit() {
    const { cart, restaurant } = this.props;

    if (restaurant.loopeatEnabled && cart.reusablePackagingEnabled) {
      if (!cart.loopeatContext?.hasCredentials) {
        DropdownHolder.getDropdown().alertWithType(
          'warn',
          this.props.t('CHECKOUT_LOOPEAT_CONNECT_ACCOUNT', {
            name: cart.loopeatContext?.name,
          }),
          this.props.t('CHECKOUT_LOOPEAT_CONNECT_ACCOUNT_TEXT', {
            name: cart.loopeatContext?.name,
          }),
        );
        return;
      }

      const missingAmount = getMissingAmount(cart.loopeatContext);

      if (missingAmount > 0) {
        DropdownHolder.getDropdown().alertWithType(
          'warn',
          this.props.t('CHECKOUT_LOOPEAT_CONNECT_ACCOUNT', {
            name: cart.loopeatContext?.name,
          }),
          this.props.t('CHECKOUT_LOOPEAT_MISSING_AMOUNT', {
            amount: formatPrice(missingAmount),
          }),
        );
        return;
      }
    }

    this.setState({ isLoading: true });

    const displayedTiming = this.props.cartContainer.timing?.range;

    const { error: timeRangeCheckFailed } = await this.props.checkTimeRange(
      cart.restaurant,
      displayedTiming,
    );
    if (timeRangeCheckFailed) {
      this.setState({ isLoading: false });
      // checkTimeRange will trigger a TimeRangeChangedModal
      return;
    }

    const { error: validationFailed } = await this.props.validateOrder(cart);

    if (validationFailed) {
      console.log('Summary; validationFailed', validationFailed);
      this.setState({ isLoading: false });
      this.props.showValidationErrors();
      return;
    }

    this.setState({ isLoading: false });
    this._navigate('CheckoutSubmitOrder');
  }

  onSubmitCoupon(code) {
    this.setState({ isCouponModalVisible: false });
    this.props.updateCart({ promotionCoupon: code });
  }

  toggleReusablePackaging() {
    this.props.updateCart({
      reusablePackagingEnabled: !this.props.cart.reusablePackagingEnabled,
    });
  }

  render() {
    const { cart, restaurant } = this.props;

    if (!cart || cart.items.length === 0) {
      return <EmptyState />;
    }

    const tipAmount = cart.adjustments.tip[0]?.amount || 0;

    const deliveryPromotions = cart.adjustments.delivery_promotion || [];
    const orderPromotions = cart.adjustments.order_promotion || [];
    const tip = cart.adjustments.tip || [];
    const reusablePackagings = cart.adjustments.reusable_packaging || [];

    const reusablePackagingAction =
      cart.potentialAction &&
      _.find(
        cart.potentialAction,
        action => action['@type'] === 'EnableReusablePackagingAction',
      );

    return (
      <SafeAreaView
        style={{ flex: 1 }}
        edges={['bottom']}
        onLayout={() => {
          const { width } = Dimensions.get('window');
          this.setState({
            translateXValue: new Animated.Value(width),
          });
        }}>
        {this.props.isValid === false && (
          <DangerAlert text={this.props.alertMessage} />
        )}

        <View style={{ flex: 1, paddingTop: 30 }}>
          <FlatList
            data={this.props.cart.items}
            keyExtractor={(item, index) => `item:${index}`}
            renderItem={({ item, index }) => (
              <Item
                item={item}
                index={index}
                translateXValue={this.state.translateXValue}
              />
            )}
            extraData={{ edit: this.props.edit }}
          />
        </View>

        <View style={{ flex: 0 }}>
          {this.props.fulfillmentMethod === 'collection' && (
            <ActionButton
              onPress={() =>
                this.setState({ isCollectionDisclaimerModalVisible: true })
              }
              iconName="info-circle"
              iconColor="primary.500">
              <Text style={{ flex: 2 }} color="primary.500" fontSize="sm">
                {this.props.t('FULFILLMENT_METHOD.collection')}
              </Text>
              <Text style={{ flex: 1, textAlign: 'right' }}>
                {this.props.t('LEARN_MORE')}
              </Text>
            </ActionButton>
          )}
          <ActionButton
            onPress={() => this.props.showTimingModal(true)}
            iconName="clock-o">
            <Text style={{ flex: 2 }} fontSize="sm">
              {this.props.timeAsText}
            </Text>
            <Text style={{ flex: 1, textAlign: 'right' }}>
              {this.props.t('EDIT')}
            </Text>
          </ActionButton>
          {this.props.fulfillmentMethod === 'delivery' &&
            this.props.cart.shippingAddress && (
              <ActionButton
                onPress={() =>
                  this.props.navigation.navigate('AccountAddresses', {
                    action: 'cart',
                    cart,
                  })
                }
                iconName="map-marker">
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ flex: 2 }}
                  fontSize="sm">
                  {this.props.cart.shippingAddress.streetAddress}
                </Text>
                <Text style={{ flex: 1, textAlign: 'right' }}>
                  {this.props.t('EDIT')}
                </Text>
              </ActionButton>
            )}
          <HStack>
            <View flex={1} style={styles.rightBorder}>
              <ActionButton
                onPress={() => this.setState({ showTipModal: true })}
                iconName="heart">
                <Text style={{ flex: 2 }} fontSize="sm">
                  {this.props.t('TIP')}:{' '}
                  {formatPrice(tipAmount, { mantissa: 0 })}
                </Text>
              </ActionButton>
            </View>
            <View flex={1}>
              <ActionButton
                onPress={() => this.setState({ isCouponModalVisible: true })}
                iconName="tag">
                <Text style={{ flex: 1, textAlign: 'right' }}>
                  {this.props.t('ADD_COUPON')}
                </Text>
              </ActionButton>
            </View>
          </HStack>
          {reusablePackagingAction && (
            <HStack
              p="3"
              justifyContent="space-between"
              alignItems="center"
              style={styles.btnGrey}>
              <Checkbox
                testID="reusablePackagingCheckbox"
                accessibilityLabel={reusablePackagingAction.description}
                defaultIsChecked={cart.reusablePackagingEnabled}
                onChange={() => this.toggleReusablePackaging()}
              />
              <Text>{reusablePackagingAction.description}</Text>
            </HStack>
          )}
          {restaurant.loopeatEnabled &&
            cart.reusablePackagingEnabled &&
            !cart.loopeatContext?.hasCredentials && (
              <ActionButton
                onPress={() =>
                  Linking.openURL(reusablePackagingAction.loopeatOAuthUrl)
                }
                iconName="external-link">
                <Text style={{ flex: 1, textAlign: 'right' }}>
                  {this.props.t('CHECKOUT_LOOPEAT_CONNECT_ACCOUNT', {
                    name: cart.loopeatContext?.name,
                  })}
                </Text>
              </ActionButton>
            )}
          {restaurant.loopeatEnabled &&
            cart.reusablePackagingEnabled &&
            cart.loopeatContext?.hasCredentials && (
              <Loopeat {...cart.loopeatContext} />
            )}
        </View>

        <View style={{ flex: 0, backgroundColor: primaryColor }}>
          <BottomLine
            label={this.props.t('TOTAL_ITEMS')}
            value={cart.itemsTotal}
          />
          {this.props.fulfillmentMethod === 'delivery' && (
            <BottomLine
              label={this.props.t('TOTAL_DELIVERY')}
              value={this.props.deliveryTotal}
            />
          )}
          <Adjustments adjustments={tip} type="tip" />
          <Adjustments
            adjustments={deliveryPromotions}
            type="delivery_promotion"
          />
          <Adjustments adjustments={orderPromotions} type="order_promotion" />
          <Adjustments
            adjustments={reusablePackagings}
            type="reusable_packaging"
          />
        </View>
        <Footer
          cart={this.props.cart}
          isValid={this.props.isValid}
          isLoading={this.props.isLoading || this.state.isLoading}
          onSubmit={this.onSubmit.bind(this)}
        />
        <ExpiredSessionModal
          onModalHide={() => this.props.navigation.navigate('CheckoutHome')}
        />
        <CouponModal
          isVisible={this.state.isCouponModalVisible}
          onSwipeComplete={() => this.setState({ isCouponModalVisible: false })}
          onSubmit={code => this.onSubmitCoupon(code)}
        />
        <CollectionDisclaimerModal
          isVisible={this.state.isCollectionDisclaimerModalVisible}
          onSwipeComplete={() =>
            this.setState({ isCollectionDisclaimerModalVisible: false })
          }
          restaurant={restaurant}
        />
        <TimingModal
          openingHoursSpecification={this.props.openingHoursSpecification}
          fulfillmentMethods={this.props.fulfillmentMethods}
          orderNodeId={this.props.cart['@id']}
          cartFulfillmentMethod={this.props.fulfillmentMethod}
          onFulfillmentMethodChange={this.props.setFulfillmentMethod}
          onSkip={() => this.setState({ modalSkipped: true })}
          onSchedule={({ value, showModal }) =>
            this.props.setDate(value, () => {
              this.props.validate(cart);
              showModal(false);
            })
          }
        />
        <TimeRangeChangedModal />
        <BottomModal
          isVisible={this.state.showTipModal}
          onBackdropPress={() => this.setState({ showTipModal: false })}
          onBackButtonPress={() => this.setState({ showTipModal: false })}>
          <Tips
            value={tipAmount}
            onTip={amount => {
              this.props.setTip(cart, amount);
              this.setState({ showTipModal: false });
            }}
          />
        </BottomModal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  btnGrey: {
    borderTopColor: '#d7d7d7',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rightBorder: {
    borderRightColor: '#d7d7d7',
    borderRightWidth: StyleSheet.hairlineWidth,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 20,
    paddingVertical: 5,
  },
  bottomLineLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  bottomLineAmount: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

function mapStateToProps(state, ownProps) {
  const cartContainer = selectCartWithHours(state);
  const { cart, restaurant, openingHoursSpecification } = cartContainer;

  const violations = selectViolations(state);

  return {
    cart,
    cartContainer,
    restaurant,
    openingHoursSpecification,
    edit: ownProps.route.params?.edit || false,
    deliveryTotal: selectDeliveryTotal(state),
    timeAsText: selectShippingTimeRangeLabel(state),
    isLoading: state.checkout.isLoading,
    isValid: selectIsValid(state),
    alertMessage: _.first(violations.map(v => v.message)),
    fulfillmentMethods: selectFulfillmentMethods(state),
    fulfillmentMethod: selectCartFulfillmentMethod(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    syncAddressAndValidate: cart => dispatch(syncAddressAndValidate(cart)),
    validateOrder: cart => dispatch(validateOrder(cart)),
    showValidationErrors: () => dispatch(showValidationErrors()),
    checkTimeRange: (restaurantNodeId, lastTimeRange) =>
      dispatch(checkTimeRange(restaurantNodeId, lastTimeRange)),
    showAddressModal: () => dispatch(showAddressModal()),
    hideAddressModal: () => dispatch(hideAddressModal()),
    updateCart: (cart, cb) => dispatch(updateCart(cart, cb)),
    setAddress: (address, cart) => dispatch(setAddress(address, cart)),
    setDate: (date, cb) => dispatch(setDate(date, cb)),
    setFulfillmentMethod: method => dispatch(setFulfillmentMethod(method)),
    showTimingModal: show => dispatch(showTimingModal(show)),
    setTip: (order, tipAmount) => dispatch(setTip(order, tipAmount)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Summary));
