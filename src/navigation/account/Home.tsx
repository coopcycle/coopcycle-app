import { Icon, ArrowRightIcon } from '@/components/ui/icon';
import { User } from 'lucide-react-native'
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import React, { Component } from 'react';
import { withTranslation, useTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';

import { useBackgroundContainerColor } from '../../styles/theme';

import ItemSeparator from '../../components/ItemSeparator';
import { deleteUser } from '../../redux/Account/actions';
import { logout } from '../../redux/App/actions';
import {
  selectCustomBuild,
  selectIsAuthenticated,
  selectUser,
} from '../../redux/App/selectors';
import LoginRegister from './AccountLoginRegister';
import Server from './components/Server';
import { SafeAreaView } from 'react-native-safe-area-context';

const DeleteAccountModal = ({ onConfirm }) => {

  const { t } = useTranslation();
  const backgroundColor = useBackgroundContainerColor();

  return (
    <View style={{ backgroundColor }}>
      <Box className="p-5">
        <Text className="mb-4">{t('DELETE_ACCOUNT_DISCLAIMER')}</Text>
        <Button
          action="negative"
          onPress={onConfirm}>
          <ButtonText>{t('DELETE_ACCOUNT')}</ButtonText>
        </Button>
      </Box>
    </View>
  )
}

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
      <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        {this.props.customBuild ? null : <Server />}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 15,
          }}>
          <Icon as={User} size={32} className="mb-2" />
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
              <Box className="px-3 py-3">
                <HStack className="justify-between">
                  <Text {...item.textProps}>{item.label}</Text>
                  <Icon as={ArrowRightIcon} />
                </HStack>
              </Box>
            </TouchableOpacity>
          )}
        />
        <Box className="p-2">
          <Button
            action="negative"
            onPress={() => this.props.logout()}
            testID="logout">
            <ButtonText>{this.props.t('SIGN_OUT')}</ButtonText>
          </Button>
        </Box>
        <Modal
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.closeModal()}
          swipeDirection={['down', 'up', 'left', 'right']}
          onBackdropPress={() => this.closeModal()}>
          <DeleteAccountModal onConfirm={() => {
            this.props.deleteUser();
            this.closeModal();
          }} />
        </Modal>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: selectUser(state),
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
