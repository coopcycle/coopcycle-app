import { Box, Button, Icon, Text } from 'native-base';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { openComposer } from 'react-native-email-link';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import ModalContent from '../../components/ModalContent';
import { selectServer } from '../../redux/App/actions';
import { selectServersWithoutRepeats } from '../../redux/App/selectors';

const CONTACT_EMAIL = 'contact@coopcycle.org';

class ChooseCity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
    };
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => this.props.selectServer(item.coopcycle_url)}
        testID={item.city}>
        <Text style={{ textAlign: 'center' }}>{item.city}</Text>
      </TouchableOpacity>
    );
  }

  openEmail() {
    if (Platform.OS === 'ios') {
      openComposer({
        to: CONTACT_EMAIL,
      });
    } else {
      Linking.openURL(`mailto:${CONTACT_EMAIL}`);
    }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'column',
          }}>
          <Text note style={{ textAlign: 'center', paddingVertical: 15 }}>
            {this.props.t('CHOOSE_SERVER')}
          </Text>
          <View style={{ flex: 1 }}>
            <FlatList
              testID="cityList"
              data={this.props.servers}
              keyExtractor={(item, index) => `server:${index}`}
              renderItem={({ item, index }) => this.renderItem(item, index)}
              ItemSeparatorComponent={ItemSeparator}
            />
            {this.props.hasError && (
              <View style={{ marginVertical: 20 }}>
                <Text style={{ color: '#ed2f2f', textAlign: 'center' }}>
                  {this.props.message}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 15,
            }}
            onPress={() => this.setState({ isModalVisible: true })}>
            <Icon
              as={FontAwesome5}
              name="question-circle"
              style={{ marginRight: 10, fontSize: 22, color: '#0074D9' }}
            />
            <Text note style={{ textAlign: 'center', color: '#0074D9' }}>
              {this.props.t('CITY_NOT_LISTED')}
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={this.state.isModalVisible}
          onSwipeComplete={() => this.setState({ isModalVisible: false })}
          swipeDirection={['up', 'down']}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}>
            <ModalContent>
              <Box p="4">
                <Text style={{ marginBottom: 20, fontSize: 14 }}>
                  {this.props.t('ABOUT_COOPCYCLE')}
                </Text>
                <Button
                  leftIcon={
                    <Icon as={FontAwesome5} name="envelope" size="sm" />
                  }
                  onPress={() => this.openEmail()}>
                  {this.props.t('CONTACT_US')}
                </Button>
              </Box>
            </ModalContent>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});

function mapStateToProps(state) {
  return {
    servers: selectServersWithoutRepeats(state),
    hasError: !!state.app.selectServerError,
    message: state.app.selectServerError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectServer: server => dispatch(selectServer(server)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(ChooseCity));
