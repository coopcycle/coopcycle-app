import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { HStack, Icon, Text } from 'native-base';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  clearTasksFilter,
  filterTasks,
  selectIsTagHidden,
  selectTagNames,
} from '../../redux/Courier';
import ItemSeparator from '../../components/ItemSeparator';

const Tags = ({ toggleDisplayTag, isTagHidden, tags, t }) => (
  <FlatList
    data={tags}
    keyExtractor={(item, index) => item}
    ItemSeparatorComponent={ItemSeparator}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => toggleDisplayTag(item, isTagHidden(item))}>
        <HStack
          justifyContent="space-between"
          onPress={() => toggleDisplayTag(item, isTagHidden(item))}
          p="3">
          <Text>{item}</Text>
          <Icon
            as={FontAwesome}
            name={isTagHidden(item) ? 'eye-slash' : 'eye'}
            size="sm"
          />
        </HStack>
      </TouchableOpacity>
    )}
  />
);

function mapStateToProps(state) {
  return {
    tags: selectTagNames(state),
    isTagHidden: selectIsTagHidden(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDisplayTag: (tag, hidden) =>
      dispatch(
        hidden ? clearTasksFilter({ tags: tag }) : filterTasks({ tags: tag }),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Tags));
