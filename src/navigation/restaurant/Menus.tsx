import { Icon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Check } from 'lucide-react-native'
import React, { Component } from 'react';
import { FlatList, InteractionManager, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { activateMenu, loadMenus } from '../../redux/Restaurant/actions';

class Menus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      currentItem: null,
    };
  }

  componentDidMount() {
    this.props.loadMenus(this.props.restaurant);
  }

  renderItem(item) {
    return (
      <Pressable
        onPress={() =>
          this.setState({ isModalVisible: true, currentItem: item })
        }>
        <HStack className="justify-between p-3">
          <Text>{item.name}</Text>
          {item.active && <Icon as={Check} />}
        </HStack>
      </Pressable>
    );
  }

  _keyExtractor(item, index) {
    return item.identifier;
  }

  _onConfirm() {
    const currentItem = { ...this.state.currentItem };
    this.setState(
      {
        isModalVisible: false,
        currentItem: null,
      },
      () => {
        InteractionManager.runAfterInteractions(() =>
          this.props.activateMenu(this.props.restaurant, currentItem),
        );
      },
    );
  }

  render() {
    let { menus } = this.props;

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={menus}
          keyExtractor={this._keyExtractor}
          renderItem={({ item }) => this.renderItem(item)}
          initialNumToRender={5}
        />
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalContent}>
            <Button
              action="positive"
              onPress={() => this._onConfirm()}
              style={{ marginBottom: 15 }}>
              <ButtonText>
                {this.props.t('RESTAURANT_SETTINGS_MENU_ACTIVATE', {
                  name: this.state.currentItem
                    ? this.state.currentItem.name
                    : '',
                })}
              </ButtonText>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() =>
                this.setState({ isModalVisible: false, currentItem: null })
              }>
              <ButtonText>{this.props.t('CANCEL')}</ButtonText>
            </Button>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function mapStateToProps(state) {
  return {
    restaurant: state.restaurant.restaurant,
    menus: state.restaurant.menus,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadMenus: restaurant => dispatch(loadMenus(restaurant)),
    activateMenu: (restaurant, menu) =>
      dispatch(activateMenu(restaurant, menu)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Menus));
