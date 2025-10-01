import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import _ from 'lodash';
import { Icon } from '@/components/ui/icon';
import { User, Phone, Mail } from 'lucide-react-native'
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Heading } from '@/components/ui/heading';
import React, { Component } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { phonecall } from 'react-native-communications';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VersionNumber from 'react-native-version-number';
import { connect } from 'react-redux';

import Mailto from '../../components/Mailto';
import {
  selectIsAuthenticated,
  selectShowRestaurantsDrawerItem,
  selectUser,
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
    <Box className="mb-4">
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

const SafeAreaViewWrapper = ({ children }) => {

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={[ styles.container, {
        paddingTop: insets.top,
        paddingBottom: insets.bottom
      }]}>
      { children }
    </SafeAreaView>
  )
}

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
      <SafeAreaViewWrapper>
        <TouchableOpacity
          style={styles.header}
          onPress={navigateToAccount}
          testID="drawerAccountBtn">
          <Icon as={User} size="xl" />
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
          <VStack className="p-3 items-center">
            <About
              brandName={this.props.brandName}
              motto={this.props.motto}
              navigate={this.props.showAbout}
            />
            {(this.props.email || this.props.phoneNumber) && (
              <HStack className="w-full items-left justify-between mb-4">
                <Text>{this.props.t('CONTACT_US')}</Text>
                <Box
                  style={{ width: '30%' }}
                  className="justify-between flex-row">
                  {this.props.email && (
                    <Mailto email={this.props.email}>
                      <Icon as={Mail} size="sm" />
                    </Mailto>
                  )}
                  {this.props.phoneNumber && (
                    <TouchableOpacity
                      ml="10"
                      mr="10"
                      onPress={() => phonecall(this.props.phoneNumber, true)}>
                      <Icon as={Phone} size="sm" />
                    </TouchableOpacity>
                  )}
                </Box>
              </HStack>
            )}
            <HStack className="w-full items-center justify-between mb-4">
              <Pressable onPress={navigateToTerms}>
                <Text>{this.props.t('TERMS_OF_SERVICE')}</Text>
              </Pressable>
            </HStack>
            <HStack className="w-full items-center justify-between mb-4">
              <Pressable onPress={navigateToPricacy}>
                <Text>{this.props.t('PRIVACY')}</Text>
              </Pressable>
            </HStack>
            <Pressable onPress={onAppVersionPress}>
              <Text>{`${VersionNumber.appVersion} (${VersionNumber.buildVersion})`}</Text>
            </Pressable>
          </VStack>
        </View>
      </SafeAreaViewWrapper>
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
    user: selectUser(state),
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
