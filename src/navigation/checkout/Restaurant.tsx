import React, { useRef, useState } from 'react';
import _ from 'lodash';
import {
  Box,
  Center,
  FlatList,
  HStack,
  Heading,
  Icon,
  Skeleton,
  Text,
  VStack,
} from 'native-base';
import { withTranslation } from 'react-i18next';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { connect } from 'react-redux';

import CartFooter from './components/CartFooter';
import ExpiredSessionModal from './components/ExpiredSessionModal';
import LoopeatModal from './components/LoopeatModal';

import { phonecall } from 'react-native-communications';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useQuery } from 'react-query';
import BottomModal from '../../components/BottomModal';
import Markdown from '../../components/Markdown';
import RestaurantMenuHeader from '../../components/RestaurantMenuHeader';
import RestaurantMenuItem from '../../components/RestaurantMenuItem';
import i18n from '../../i18n';
import { setDate, setFulfillmentMethod } from '../../redux/Checkout/actions';
import {
  selectCartFulfillmentMethod,
  selectCartWithHours,
  selectFulfillmentMethods,
  selectRestaurantWithHours,
} from '../../redux/Checkout/selectors';
import AddressUtils from '../../utils/Address';
import OpeningHours from './components/OpeningHours';
import RestaurantProfile from './components/RestaurantProfile';

const LoadingPhantom = props => (
  <HStack w="95%" space={6} p="4">
    <VStack flex="3" space="3">
      <Skeleton flex={1} />
      <Skeleton.Text flex={1} lines={2} />
      <HStack flex={1} space="2" alignItems="center">
        <Skeleton size="4" rounded="full" />
        <Skeleton h="3" flex="2" rounded="full" />
        <Skeleton h="3" flex="1" rounded="full" startColor={props.color} />
      </HStack>
    </VStack>
    <Skeleton flex="1" h="100" w="100" rounded="md" />
  </HStack>
);

function Restaurant(props) {
  const { navigate } = props.navigation;
  const colorScheme = useColorScheme();
  const [infoModal, setInfoModal] = useState(false);
  const { showFooter, httpClient, restaurant, openingHoursSpecification } =
    props;
  const sectionListRef = useRef(null);

  const [activeSection, setActiveSection] = useState(null);
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveSection(viewableItems[0].index);
    }
  });
  const screenHeight = Dimensions.get('window').height;

  const { isLoading, isError, data } = useQuery(
    ['menus', restaurant.hasMenu],
    async () => {
      return await httpClient.get(restaurant.hasMenu, {}, { anonymous: true });
    },
  );

  //TODO: improve failed view
  if (isError) {
    return (
      <Center w="95%">
        <Heading>{i18n.t('AN_ERROR_OCCURRED')} </Heading>
        <Text>{i18n.t('TRY_LATER')}</Text>
      </Center>
    );
  }

  const cardStyle = {
    ...styles.card,
    backgroundColor:
      colorScheme === 'dark'
        ? 'rgba(255, 255, 255, 0.04)'
        : 'rgba(0, 0, 0, 0.02)',
    borderColor:
      colorScheme === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.1)',
  };

  let sections = [];
  if (data) {
    _.forEach(data.hasMenuSection, (menuSection, index) => {
      sections.push({
        title: menuSection.name,
        data: menuSection.hasMenuItem,
        index,
      });
    });
  }

  const renderRestaurantProfile = () => (
    <RestaurantProfile
      onInfo={() => setInfoModal(true)}
      restaurant={restaurant}
      openingHoursSpecification={openingHoursSpecification}
    />
  );

  const renderRestaurantMenuHeader = () => (
    <RestaurantMenuHeader
      activeSection={activeSection}
      offsetSectionsCount={2}
      sectionRef={sectionListRef}
      sections={sections}
      isLoading={isLoading}
    />
  );

  const renderSection = section => (
    <>
      <View id={'section-' + section.index}>
        <Text
          style={{
            fontSize: 18,
            marginHorizontal: 16,
            marginTop: 48,
            marginBottom: 8,
          }}>
          {section.title}
        </Text>
        {section.data.map((item, innerIndex) => (
          <RestaurantMenuItem
            testID={`menuItem:${section.index}:${innerIndex}`}
            item={item}
            isLoading={isLoading}
            key={innerIndex}
            onPress={menuItem =>
              navigate('CheckoutProductDetails', {
                product: menuItem,
                restaurant,
              })
            }
          />
        ))}
      </View>
    </>
  );

  const renderEmptyFooter = () => (
    <View style={{ height: screenHeight * 0.4 }}></View>
  );

  const renderFunctions = [
    renderRestaurantProfile,
    renderRestaurantMenuHeader,
    ...sections.map(section => () => renderSection(section)),
    renderEmptyFooter,
  ];

  const listRenderItem = ({ item, index }) => {
    return renderFunctions[index] ? renderFunctions[index]() : null;
  };

  return (
    <View
      style={{
        width: '100%',
        maxHeight: '100%',
      }}>
      <FlatList
        testID="restaurantData"
        stickyHeaderIndices={[1]}
        data={Array.from(
          { length: renderFunctions.length },
          (_, index) => index,
        )}
        renderItem={listRenderItem}
        ref={sectionListRef}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={handleViewableItemsChanged.current}
      />
      {showFooter ? (
        <SafeAreaView edges={['bottom']}>
          <CartFooter
            onSubmit={() => navigate('CheckoutSummary', { restaurant })}
            restaurant={restaurant}
            cart={props.cart}
            initLoading={props.cartLoading}
            testID="cartSubmit"
            disabled={isLoading}
          />
        </SafeAreaView>
      ) : null}

      <BottomModal
        isVisible={infoModal}
        onBackdropPress={() => setInfoModal(false)}
        onBackButtonPress={() => setInfoModal(false)}>
        <Box style={styles.center}>
          <Heading>{restaurant.name}</Heading>
          <Markdown>{restaurant.description}</Markdown>
          <Text bold padding={3}>
            {i18n.t('RESTAURANT_OPENING_HOURS')}
          </Text>
          <OpeningHours
            openingHoursSpecification={openingHoursSpecification}
          />
        </Box>
        <Pressable
          onPress={() => {
            AddressUtils.openMap(restaurant.address, restaurant.name);
          }}>
          <HStack space={3} style={cardStyle}>
            <Icon as={Ionicons} name="map" size={5} color={'blueGray.600'} />
            <Text>{restaurant.address.streetAddress}</Text>
          </HStack>
        </Pressable>
        <Pressable
          onPress={() => {
            phonecall(restaurant.telephone, true);
          }}>
          <HStack space={3} style={cardStyle}>
            <Icon as={Ionicons} name="call" size={5} color={'blueGray.600'} />
            <Text>
              {i18n.t('CALL')} {restaurant.name}
            </Text>
          </HStack>
        </Pressable>
      </BottomModal>

      <ExpiredSessionModal onModalHide={() => navigate('CheckoutHome')} />
      <LoopeatModal />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: 12,
  },
});

function mapStateToProps(state, ownProps) {
  const { restaurant, openingHoursSpecification } =
    selectRestaurantWithHours(state);
  const cartContainer = selectCartWithHours(state);
  const cart = cartContainer?.cart;
  const cartLoading = _.includes(
    state.checkout.loadingCarts,
    restaurant['@id'],
  );
  const isCartEmpty = !selectCartWithHours(state).cart
    ? true
    : cart.items.length === 0;

  return {
    showFooter: !isCartEmpty || cartLoading,
    cartLoading,
    restaurant,
    openingHoursSpecification,
    cartContainer,
    cart,
    address: state.checkout.address,
    loadingItems: state.checkout.itemRequestStack,
    isExpiredSessionModalVisible: state.checkout.isExpiredSessionModalVisible,
    httpClient: state.app.httpClient,
    fulfillmentMethods: selectFulfillmentMethods(state),
    fulfillmentMethod: selectCartFulfillmentMethod(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setDate: (date, cb) => dispatch(setDate(date, cb)),
    setFulfillmentMethod: method => dispatch(setFulfillmentMethod(method)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Restaurant));
