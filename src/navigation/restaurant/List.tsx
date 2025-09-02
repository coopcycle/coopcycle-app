import { Icon, CheckIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import { changeRestaurant } from '../../redux/Restaurant/actions';

class ListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  _onRestaurantClick(restaurant) {
    this.props.changeRestaurant(restaurant);
    this.props.navigation.navigate('RestaurantHome');
  }

  renderRestaurants() {
    const { restaurants, currentRestaurant } = this.props;

    return (
      <FlatList
        keyExtractor={(item, index) => `${index}`}
        ItemSeparatorComponent={ItemSeparator}
        data={restaurants}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => this._onRestaurantClick(item)}>
            <HStack className="justify-between p-3">
              <Text>{item.name}</Text>
              {item['@id'] === currentRestaurant['@id'] && (
                <Icon as={CheckIcon} />
              )}
            </HStack>
          </TouchableOpacity>
        )}
      />
    );
  }

  render() {
    return (
      <Box>
        <Box style={styles.helpContainer}>
          <Text style={styles.helpText}>
            {this.props.i18n.t('RESTAURANT_LIST_CLICK_BELOW')}
          </Text>
        </Box>
        {this.renderRestaurants()}
      </Box>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  helpContainer: {
    paddingVertical: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

function mapStateToProps(state) {
  return {
    restaurants: state.restaurant.myRestaurants,
    currentRestaurant: state.restaurant.restaurant,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeRestaurant: restaurant => dispatch(changeRestaurant(restaurant)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ListScreen));
