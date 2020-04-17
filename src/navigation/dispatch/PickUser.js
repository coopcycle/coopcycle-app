import React, { Component } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { Text, Icon } from 'native-base'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

import Avatar from '../../components/Avatar'
import ItemSeparatorComponent from '../../components/ItemSeparator'

class PickUser extends Component {

  renderItem(user) {

    return (
      <TouchableOpacity
        onPress={ () => this.props.onPress(user) }
        testID={ `assignTo:${user.username}` }
        style={ styles.item }>
        <Avatar baseURL={ this.props.baseURL } username={ user.username } />
        <Text style={ styles.itemText }>{ user.username }</Text>
        <Icon name="arrow-forward" />
      </TouchableOpacity>
    )
  }

  render() {

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={ this.props.users }
          keyExtractor={ (item, index) => item.username }
          renderItem={ ({ item, index }) => this.renderItem(item, index) }
          ItemSeparatorComponent={ ItemSeparatorComponent } />
      </View>
    )
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
})

function mapStateToProps(state, ownProps) {

  const users = _.filter(state.dispatch.users, user => _.includes(user.roles, 'ROLE_COURIER'))

  return {
    baseURL: state.app.baseURL,
    users: users,
    onPress: ownProps.navigation.getParam('onItemPress'),
  }
}


export default connect(mapStateToProps)(withTranslation()(PickUser))
