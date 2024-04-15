import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Box, Button, FlatList, HStack, Icon, Text } from 'native-base';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

import Server from './components/Server';
import { logout } from '../../redux/App/actions';
import { deleteUser } from '../../redux/Account/actions';
import {
  selectCustomBuild,
  selectIsAuthenticated,
} from '../../redux/App/selectors';
import ItemSeparator from '../../components/ItemSeparator';
import LoginRegister from './LoginRegister';

class AccountHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  closeModal() {
    this.setState({ isModalVisible: false });
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <LoginRegister navigation={this.props.navigation} />;
    }

    const { navigate } = this.props.navigation;

    const data = [
      {
        label: this.props.t('DETAILS'),
        onPress: () => navigate('AccountDetails'),
      },
      {
        label: this.props.t('ADDRESSES'),
        onPress: () => navigate('AccountAddresses'),
      },
      {
        label: this.props.t('ORDERS'),
        onPress: () => navigate('AccountOrdersList'),
      },
      {
        label: this.props.t('DELETE_ACCOUNT'),
        onPress: () => this.setState({ isModalVisible: true }),
        textProps: {
          color: 'danger.700',
        },
      },
    ];

    return (
      <View style={{ flex: 1 }}>
        {this.props.customBuild ? null : <Server />}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <Icon as={Ionicons} name="person" />
          <Text
            style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>
            {`${this.props.t('HELLO')} ${this.props.user.username}`}
          </Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item, index) => `account-${index}`}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={item.onPress}>
              <Box px="3" py="3">
                <HStack space={3} justifyContent="space-between">
                  <Text {...item.textProps}>{item.label}</Text>
                  <Icon as={Ionicons} name="arrow-forward" />
                </HStack>
              </Box>
            </TouchableOpacity>
          )}
        />
        <Box p="2">
          <Button
            colorScheme="secondary"
            onPress={() => this.props.logout()}
            testID="logout">
            {this.props.t('SIGN_OUT')}
          </Button>
        </Box>
        <Modal
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.closeModal()}
          swipeDirection={['down', 'up', 'left', 'right']}
          onBackdropPress={() => this.closeModal()}>
          <View style={{ backgroundColor: 'white' }}>
            <Box p="4">
              <Text mb="3">{this.props.t('DELETE_ACCOUNT_DISCLAIMER')}</Text>
              <Button
                colorScheme="secondary"
                onPress={() => {
                  this.props.deleteUser();
                  this.closeModal();
                }}>
                {this.props.t('DELETE_ACCOUNT')}
              </Button>
            </Box>
          </View>
        </Modal>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.app.user,
    isAuthenticated: selectIsAuthenticated(state),
    customBuild: selectCustomBuild(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
    deleteUser: () => dispatch(deleteUser()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(AccountHome));
