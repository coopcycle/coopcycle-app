import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { Icon, Text } from 'native-base';
import { withTranslation } from 'react-i18next';
import _ from 'lodash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Avatar from '../../components/Avatar';
import ItemSeparatorComponent from '../../components/ItemSeparator';
import { greenColor } from '../../styles/common';

import { selectUser } from '../../redux/App/selectors';

class PickUser extends Component {
  renderItem(user) {
    return (
      <TouchableOpacity
        onPress={() => this.props.onPress(user)}
        testID={`assignTo:${user.username}`}
        style={styles.item}>
        <Avatar baseURL={this.props.baseURL} username={user.username} />
        <Text style={styles.itemText}>{user.username}</Text>
        <Icon as={FontAwesome} name="arrow-right" size="sm" />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.users}
          keyExtractor={(item, index) => item.username}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
        {this.props.selfAssign && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.onPress(this.props.user)}>
            <Text>{this.props.t('DISPATCH_ASSIGN_TO_ME')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  itemText: {
    flex: 1,
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: greenColor,
  },
});

function mapStateToProps(state, ownProps) {
  const user = selectUser(state);
  const users = _.filter(
    state.dispatch.users,
    u => _.includes(u.roles, 'ROLE_COURIER') && u.username !== user.username,
  );

  users.sort((a, b) => (a.username < b.username ? -1 : 1));

  const withSelfAssignBtn = ownProps.route.params?.withSelfAssignBtn || true;

  return {
    baseURL: state.app.baseURL,
    users: users,
    onPress: ownProps.route.params?.onItemPress,
    selfAssign: withSelfAssignBtn && _.includes(user.roles, 'ROLE_COURIER'),
    user,
  };
}

export default connect(mapStateToProps)(withTranslation()(PickUser));
