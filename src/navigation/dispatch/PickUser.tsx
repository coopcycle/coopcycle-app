import _ from 'lodash';
import { connect } from 'react-redux';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, ArrowRightIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { withTranslation } from 'react-i18next';
import React, { Component } from 'react';

import { greenColor, redColor, whiteColor } from '../../styles/common';
import { selectUser } from '../../redux/App/selectors';
import Avatar from '../../components/Avatar';
import ItemSeparatorComponent from '../../components/ItemSeparator';

class PickUser extends Component {
  renderItem(user) {
    return (
      <TouchableOpacity
        onPress={() => this.props.onItemPress(user)}
        testID={`assignTo:${user.username}`}
        style={styles.item}>
        <Avatar baseURL={this.props.baseURL} username={user.username} />
        <Text style={styles.itemText}>{user.username}</Text>
        <Icon as={ArrowRightIcon} size="sm" />
      </TouchableOpacity>
    );
  }

  render() {
    const {
      onItemPress,
      onUnassignButtonPress,
      selfAssign,
      showUnassignButton,
      t,
      user,
      users,
    } = this.props;

    return (
      <View style={{ flex: 1 }}>
        {showUnassignButton && (
          <TouchableOpacity
            style={styles.unassignButton}
            onPress={() => onUnassignButtonPress()}
            testID={`unassignTask`}>
            <Text style={styles.buttonText}>{t('DISPATCH_UNASSIGN')}</Text>
          </TouchableOpacity>
        )}
        <FlatList
          data={users}
          keyExtractor={(item, index) => item.username}
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
        {selfAssign && (
          <TouchableOpacity
            style={styles.assignToMeButton}
            onPress={() => onItemPress(user)}>
            <Text style={styles.buttonText}>{t('DISPATCH_ASSIGN_TO_ME')}</Text>
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
  unassignButton: {
    alignItems: 'center',
    backgroundColor: redColor,
    padding: 20,
  },
  assignToMeButton: {
    alignItems: 'center',
    backgroundColor: greenColor,
    padding: 20,
  },
  buttonText: {
    color: whiteColor,
  },
});

function mapStateToProps(state, ownProps) {
  const user = selectUser(state);
  const users = _.filter(
    state.dispatch.users,
    u => _.includes(u.roles, 'ROLE_COURIER') && u.username !== user.username,
  );

  const withSelfAssignBtn = ownProps.route.params?.withSelfAssignBtn || true;

  return {
    baseURL: state.app.baseURL,
    users: users,
    onItemPress: ownProps.route.params?.onItemPress,
    showUnassignButton: ownProps.route.params?.showUnassignButton,
    onUnassignButtonPress: ownProps.route.params?.onUnassignButtonPress,
    selfAssign: withSelfAssignBtn && _.includes(user.roles, 'ROLE_COURIER'),
    user,
  };
}

export default connect(mapStateToProps)(withTranslation()(PickUser));
