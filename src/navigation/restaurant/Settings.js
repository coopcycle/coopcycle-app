import {
  Box,
  FlatList,
  HStack,
  Icon,
  Pressable,
  Switch,
  Text,
} from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import { changeStatus } from '../../redux/Restaurant/actions';

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
        icon: 'fire',
        label: this.props.t('RESTAURANT_SETTINGS_RUSH'),
        switch: (
          <Switch
            isChecked={this.state.restaurantState === 'rush'}
            onToggle={this._onRushValueChange.bind(this)}
          />
        ),
      },
      {
        icon: 'tag',
        label: this.props.t('RESTAURANT_SETTINGS_MANAGE_PRODUCTS'),
        onPress: () => navigate('RestaurantProducts'),
      },
      {
        icon: 'sliders',
        label: this.props.t('RESTAURANT_SETTINGS_MANAGE_PRODUCT_OPTIONS'),
        onPress: () => navigate('RestaurantProductOptions'),
      },
      {
        icon: 'calendar',
        label: this.props.t('RESTAURANT_SETTINGS_OPENING_HOURS'),
        onPress: () => navigate('RestaurantOpeningHours'),
      },
      {
        icon: 'list',
        label: this.props.t('RESTAURANT_SETTINGS_MENUS'),
        onPress: () => navigate('RestaurantMenus'),
      },
      {
        icon: 'print',
        label: this.props.t('RESTAURANT_SETTINGS_PRINTER'),
        onPress: () => navigate('RestaurantPrinter'),
      },
    ];

    if (restaurants.length > 1) {
      items.push({
        icon: 'refresh',
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
              <Pressable {...itemProps} py="3" px="2">
                <HStack justifyContent="space-between">
                  <HStack>
                    <Icon name={item.icon} as={FontAwesome} size="sm" mr="2" />
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
    httpClient: state.app.httpClient,
    restaurant: state.restaurant.restaurant,
    restaurants: state.restaurant.myRestaurants,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeStatus: (restaurant, state) =>
      dispatch(changeStatus(restaurant, state)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SettingsScreen));
