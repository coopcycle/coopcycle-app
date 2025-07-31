import { Box, HStack, Icon, Text } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
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
            <HStack justifyContent="space-between" p="3">
              <Text>{item.name}</Text>
              {item['@id'] === currentRestaurant['@id'] && (
                <Icon as={FontAwesome} name="check-square" />
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
