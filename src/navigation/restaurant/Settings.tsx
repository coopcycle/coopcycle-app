import { Flame, Tag, SlidersVertical, PowerOff, Calendar, List, Printer, RefreshCw } from 'lucide-react-native'
import { Icon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { Pressable } from '@/components/ui/pressable';
import { HStack } from '@/components/ui/hstack';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Alert, FlatList, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import { changeStatus, closeRestaurant } from '../../redux/Restaurant/actions';
import { selectSpecialOpeningHoursSpecificationForToday } from '../../redux/Restaurant/selectors';
import { selectHttpClient } from '../../redux/App/selectors';

class SettingsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      restaurantState: props.restaurant.state,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.restaurantState !== prevState.restaurantState) {
      this.props.changeStatus(
        this.props.restaurant,
        this.state.restaurantState,
      );
    }
  }

  _onRushValueChange(value) {
    this.setState({ restaurantState: value ? 'rush' : 'normal' });
  }

  render() {
    const { navigate } = this.props.navigation;
    const { restaurants } = this.props;

    const items = [
      {
        icon: Flame,
        label: this.props.t('RESTAURANT_SETTINGS_RUSH'),
        switch: (
          <Switch
            value={this.state.restaurantState === 'rush'}
            onToggle={this._onRushValueChange.bind(this)}
          />
        ),
      },
      {
        icon: Tag,
        label: this.props.t('RESTAURANT_SETTINGS_MANAGE_PRODUCTS'),
        onPress: () => navigate('RestaurantProducts'),
      },
      {
        icon: SlidersVertical,
        label: this.props.t('RESTAURANT_SETTINGS_MANAGE_PRODUCT_OPTIONS'),
        onPress: () => navigate('RestaurantProductOptions'),
      },
      ...(!this.props.specialOpeningHoursSpecificationForToday
        ? [
            {
              icon: PowerOff,
              label: this.props.t('RESTAURANT_CLOSE_ALERT_TITLE'),
              onPress: () => {
                Alert.alert(
                  this.props.t('RESTAURANT_CLOSE_ALERT_TITLE'),
                  this.props.t('RESTAURANT_CLOSE_ALERT_MESSAGE'),
                  [
                    {
                      text: this.props.t('RESTAURANT_CLOSE_ALERT_CONFIRM'),
                      onPress: () =>
                        this.props.closeRestaurant(this.props.restaurant),
                    },
                    {
                      text: this.props.t('CANCEL'),
                      style: 'cancel',
                    },
                  ],
                );
              },
            },
          ]
        : []),
      {
        icon: Calendar,
        label: this.props.t('RESTAURANT_SETTINGS_OPENING_HOURS'),
        onPress: () => navigate('RestaurantOpeningHours'),
      },
      {
        icon: List,
        label: this.props.t('RESTAURANT_SETTINGS_MENUS'),
        onPress: () => navigate('RestaurantMenus'),
      },
      {
        icon: Printer,
        label: this.props.t('RESTAURANT_SETTINGS_PRINTER'),
        onPress: () => navigate('RestaurantPrinter'),
      },
    ];

    if (restaurants.length > 1) {
      items.push({
        icon: RefreshCw,
        label: this.props.t('RESTAURANT_SETTINGS_CHANGE_RESTAURANT'),
        onPress: () => navigate('RestaurantList'),
      });
    }

    return (
      <Box>
        <View style={{ paddingHorizontal: 10, paddingVertical: 20 }}>
          <Text style={{ textAlign: 'center' }}>
            {this.props.t('RESTAURANT_SETTINGS_HEADING', {
              name: this.props.restaurant.name,
            })}
          </Text>
        </View>
        <FlatList
          data={items}
          keyExtractor={(item, index) => `item-${index}`}
          renderItem={({ item }) => {
            let itemProps = {};

            if (item.onPress) {
              itemProps = {
                ...itemProps,
                onPress: item.onPress,
              };
            }

            return (
              <Pressable {...itemProps} className="py-3 px-2">
                <HStack className="justify-between">
                  <HStack  className="items-center">
                    <Icon as={item.icon} size="xl" className="mr-3" />
                    <Text>{item.label}</Text>
                  </HStack>
                  {item.switch && item.switch}
                </HStack>
              </Pressable>
            );
          }}
          ItemSeparatorComponent={ItemSeparator}
        />
      </Box>
    );
  }
}

function mapStateToProps(state) {
  return {
    httpClient: selectHttpClient(state),
    restaurant: state.restaurant.restaurant,
    restaurants: state.restaurant.myRestaurants,
    specialOpeningHoursSpecificationForToday:
      selectSpecialOpeningHoursSpecificationForToday(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: (restaurant, state) =>
      dispatch(changeStatus(restaurant, state)),
    closeRestaurant: restaurant => dispatch(closeRestaurant(restaurant)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SettingsScreen));
