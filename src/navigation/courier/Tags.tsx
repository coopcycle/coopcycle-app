import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { FlatList, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import {
  clearTasksFilter,
  filterTasks,
  selectIsTagHidden,
  selectTagNames,
} from '../../redux/Courier';
import { filterByTag } from '../../redux/logistics/filters';

const Tags = ({ toggleDisplayTag, isTagHidden, tags, t }) => (
  <FlatList
    data={tags}
    keyExtractor={(item, index) => item}
    ItemSeparatorComponent={ItemSeparator}
    renderItem={({ item }) => (
      <TouchableOpacity
        onPress={() => toggleDisplayTag(item, isTagHidden(item))}>
        <HStack
          className="justify-between p-3"
          onPress={() => toggleDisplayTag(item, isTagHidden(item))}>
          <Text>{item}</Text>
          <FontAwesome
            name={isTagHidden(item) ? 'eye-slash' : 'eye'}
            size={24}
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
        hidden
          ? clearTasksFilter(filterByTag(tag))
          : filterTasks(filterByTag(tag)),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Tags));
