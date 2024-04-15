import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Box,
  HStack,
  Icon,
  Pressable,
  Text,
  VStack,
  Heading,
} from 'native-base';
import _ from 'lodash';
import { connect } from 'react-redux';
import { useTranslation, withTranslation } from 'react-i18next';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VersionNumber from 'react-native-version-number';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { phonecall } from 'react-native-communications';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Mailto from '../../components/Mailto';
import {
  selectIsAuthenticated,
  selectShowRestaurantsDrawerItem,
} from '../../redux/App/selectors';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

const RestaurantsDrawerItem = ({ restaurants, navigate }) => {
  const { t } = useTranslation();

  if (restaurants.length === 1) {
    return (
      <DrawerItem
        label={_.first(restaurants).name}
        onPress={() => navigate('RestaurantNav')}
      />
    );
  }

  return (
    <DrawerItem
      label={t('RESTAURANTS')}
      onPress={() => navigate('RestaurantNav')}
    />
  );
};

const StoresDrawerItem = ({ stores, navigate }) => {
  const { t } = useTranslation();

  if (stores.length === 1) {
    return (
      <DrawerItem
        label={_.first(stores).name}
        onPress={() => navigate('StoreNav')}
      />
    );
  }

  return (
    <DrawerItem label={t('STORES')} onPress={() => navigate('StoreNav')} />
  );
};

const About = ({ brandName, motto, navigate }) => {
  const navigation = useNavigation();

  const props = navigate
    ? { onPress: () => navigation.navigate('AboutNav') }
    : {};

  return (
    <Box mb="4">
      <TouchableOpacity {...props}>
        <VStack>
          <Heading size="sm" textAlign="center" mb="2">
            {brandName}
          </Heading>
          {motto ? (
            <Text textAlign="center" fontSize="xs">
              {motto}
            </Text>
          ) : null}
        </VStack>
      </TouchableOpacity>
    </Box>
  );
};

const TAPS_TO_SHOW_FEATURE_FLAGS = 3;

class DrawerContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressedAppVersionCounter: 0,
    };
  }

  render() {
    const {
      restaurants,
      stores,
      user,
      isAuthenticated,
      showRestaurantsDrawerItem,
      // // This is coming from drawer navigator
      // descriptors,
      // state,
      // ...rest
    } = this.props;

    const navigateToAccount = () =>
      this.props.navigation.navigate('AccountNav');

    const navigateToTerms = () =>
      this.props.navigation.navigate('TermsNav', {
        screen: 'TermsHome',
        params: { showConfirmationButtons: false },
      });

    const navigateToPricacy = () =>
      this.props.navigation.navigate('PrivacyNav', {
        screen: 'PrivacyHome',
        params: { showConfirmationButtons: false },
      });

    let phoneNumberText = this.props.phoneNumber;
    if (this.props.phoneNumber) {
      try {
        phoneNumberText = phoneNumberUtil.format(
          phoneNumberUtil.parse(this.props.phoneNumber),
          PhoneNumberFormat.NATIONAL,
        );
      } catch (e) {}
    }

    const onAppVersionPress = () => {
      this.setState({
        pressedAppVersionCounter: this.state.pressedAppVersionCounter + 1,
      });
      if (this.state.pressedAppVersionCounter >= TAPS_TO_SHOW_FEATURE_FLAGS) {
        this.setState({ pressedAppVersionCounter: 0 });
        this.props.navigation.navigate('FeatureFlagsNav', {
          screen: 'FeatureFlagsHome',
        });
      }
    };

    return (
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', horizontal: 'never' }}>
        <TouchableOpacity
          style={styles.header}
          onPress={navigateToAccount}
          testID="drawerAccountBtn">
          <Icon as={Ionicons} name="person" />
          {isAuthenticated && <Text>{this.props.user.username}</Text>}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={styles.content}>
            <DrawerContentScrollView {...this.props}>
              <DrawerItem
                label={this.props.t('SEARCH')}
                onPress={() => this.props.navigation.navigate('CheckoutNav')}
              />
              {!!this.props.defaultDeliveryFormUrl && (
                <DrawerItem
                  label={this.props.t('DELIVERY')}
                  onPress={() => this.props.navigation.navigate('DeliveryNav')}
                />
              )}
              {showRestaurantsDrawerItem && (
                <RestaurantsDrawerItem
                  restaurants={restaurants}
                  navigate={this.props.navigation.navigate}
                />
              )}
              {isAuthenticated &&
                user.hasRole('ROLE_STORE') &&
                stores.length > 0 && (
                  <StoresDrawerItem
                    stores={stores}
                    navigate={this.props.navigation.navigate}
                  />
                )}
              {isAuthenticated && user.hasRole('ROLE_COURIER') && (
                <DrawerItem
                  label={this.props.t('TASKS')}
                  onPress={() => this.props.navigation.navigate('CourierNav')}
                />
              )}
              {isAuthenticated &&
                (user.hasRole('ROLE_DISPATCHER') ||
                  user.hasRole('ROLE_ADMIN')) && (
                  <DrawerItem
                    label={this.props.t('DISPATCH')}
                    onPress={() =>
                      this.props.navigation.navigate('DispatchNav')
                    }
                  />
                )}
            </DrawerContentScrollView>
          </View>
          <VStack p="3" alignItems="center">
            <About
              brandName={this.props.brandName}
              motto={this.props.motto}
              navigate={this.props.showAbout}
            />
            <HStack
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              mb="4">
              {this.props.email && (
                <Box w="50%" alignItems="center">
                  <Mailto email={this.props.email}>
                    <Icon as={AntDesign} name="mail" size="sm" />
                  </Mailto>
                </Box>
              )}
              {this.props.phoneNumber && (
                <Box w="50%" alignItems="center">
                  <TouchableOpacity
                    onPress={() => phonecall(this.props.phoneNumber, true)}>
                    <Icon as={AntDesign} name="phone" size="sm" />
                  </TouchableOpacity>
                </Box>
              )}
            </HStack>
            <HStack
              w="100%"
              alignItems="center"
              justifyContent="space-between"
              mb="4">
              <Pressable w="50%" onPress={navigateToTerms}>
                <Text textAlign="left" fontSize="xs">
                  {this.props.t('TERMS_OF_SERVICE')}
                </Text>
              </Pressable>
              <Pressable w="50%" onPress={navigateToPricacy}>
                <Text textAlign="right" fontSize="xs">
                  {this.props.t('PRIVACY')}
                </Text>
              </Pressable>
            </HStack>
            <Pressable onPress={onAppVersionPress}>
              <Text>{VersionNumber.appVersion}</Text>
            </Pressable>
          </VStack>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  itemsContainer: {
    paddingVertical: 0,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 25,
  },
  content: {
    flex: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

function mapStateToProps(state) {
  const publicServers = _.filter(state.app.servers, s => !!s.coopcycle_url);

  const showAbout = _.includes(
    publicServers.map(s => s.coopcycle_url),
    state.app.baseURL,
  );

  return {
    user: state.app.user,
    isAuthenticated: selectIsAuthenticated(state),
    restaurants: state.restaurant.myRestaurants,
    stores: state.store.myStores,
    brandName: state.app.settings.brand_name,
    phoneNumber: state.app.settings.phone_number,
    email: state.app.settings.administrator_email,
    showAbout,
    showRestaurantsDrawerItem: selectShowRestaurantsDrawerItem(state),
    defaultDeliveryFormUrl: state.app.settings.default_delivery_form_url,
    motto: state.app.settings.motto,
  };
}

export default connect(mapStateToProps)(withTranslation()(DrawerContent));
