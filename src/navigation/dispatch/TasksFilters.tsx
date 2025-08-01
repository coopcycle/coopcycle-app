import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { HStack, Icon, Switch, Text, View } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  clearTasksFilter,
  filterTasks,
  selectAreDoneTasksHidden,
  selectIsHideUnassignedFromMap,
  selectIsPolylineOn,
  selectTasksChangedAlertSound,
  setHideUnassignedFromMap,
  setPolylineOn,
  setTasksChangedAlertSound,
} from '../../redux/Courier';
import {
  filterHasIncidents,
  filterStatusDone,
} from '../../redux/logistics/filters';
import { selectAreIncidentsHidden } from '../../redux/Courier/taskSelectors';
import ActiveKeywordFilters from './components/ActiveKeywordFilters';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';
import ItemSeparatorComponent from '../../components/ItemSeparator';
import { blackColor } from '../../styles/common';

export default function TasksFilters() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const areDoneTasksHidden = useSelector(selectAreDoneTasksHidden);
  const areIncidentsHidden = useSelector(selectAreIncidentsHidden);
  const tasksChangedAlertSound = useSelector(selectTasksChangedAlertSound);
  const isHideUnassignedFromMap = useSelector(selectIsHideUnassignedFromMap);
  const isPolylineOn = useSelector(selectIsPolylineOn);

  function toggleDisplayDone(isHidden) {
    if (isHidden) {
      dispatch(clearTasksFilter(filterStatusDone));
    } else {
      dispatch(filterTasks(filterStatusDone));
    }
  }

  function toggleDisplayIncidents(isHidden) {
    if (isHidden) {
      dispatch(clearTasksFilter(filterHasIncidents));
    } else {
      dispatch(filterTasks(filterHasIncidents));
    }
  }

  function toggleTasksChangedAlertSound(enabled) {
    dispatch(setTasksChangedAlertSound(enabled));
  }

  function toggleHideUnassignedFromMap(disabled) {
    dispatch(setHideUnassignedFromMap(disabled));
  }

  function togglePolylineOnMap(enabled) {
    dispatch(setPolylineOn(enabled));
  }

  const sections = [
    {
      label: t('HIDE_DONE_TASKS'),
      onToggle: () => toggleDisplayDone(areDoneTasksHidden),
      isChecked: areDoneTasksHidden,
      testID: 'hideDoneTasksSwitch',
    },
    {
      label: t('HIDE_INCIDENTS_TASKS'),
      onToggle: () => toggleDisplayIncidents(areIncidentsHidden),
      isChecked: areIncidentsHidden,
      testID: 'hideIncidentsSwitch',
    },
    {
      label: t('TASKS_CHANGED_ALERT_SOUND'),
      onToggle: toggleTasksChangedAlertSound,
      isChecked: tasksChangedAlertSound,
    },
    {
      label: t('TASKS_HIDE_UNASSIGNED'),
      onToggle: toggleHideUnassignedFromMap,
      isChecked: isHideUnassignedFromMap,
      testID: 'toggleUnassignedFromMapSwitch',
    },
    {
      label: t('TASKS_SHOW_POLYLINE'),
      onToggle: togglePolylineOnMap,
      isChecked: isPolylineOn,
      testID: 'togglePolylinesFromMapSwitch',
    },
    {
      label: t('FILTER_BY_KEYWORDS'),
      isFilterByKeywordsSection: true,
      testID: 'showKeywordsFiltersButton',
    },
  ];

  const renderItem = ({ item }) => <SettingsItemInner item={item} />;

  return (
    <BasicSafeAreaView>
      <View style={styles.view} testID="dispatchTasksFiltersView">
        <FlatList
          data={sections}
          keyExtractor={(item, index) => item.label}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </View>
    </BasicSafeAreaView>
  );
}

function SettingsItemInner({ item }) {
  return item.isFilterByKeywordsSection ? (
    <FilterByKeywords item={item} />
  ) : (
    <SettingsItemSwitch item={item} />
  );
}

function SettingsItemSwitch({ item }) {
  return (
    <HStack alignItems="center" justifyContent="space-between" py="3">
      <Text>{item.label}</Text>
      <Switch
        onToggle={item.onToggle}
        isChecked={item.isChecked}
        testID={item.testID || ''}
      />
    </HStack>
  );
}

function FilterByKeywords({ item }) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const navigateToKeywordsFilters = () => {
    navigation.navigate('DispatchKeywordsFilters');
  };

  return (
    <TouchableOpacity
      onPress={navigateToKeywordsFilters}
      testID={item.testID || ''}>
      <HStack alignItems="center" justifyContent="space-between" py="3">
        <Text>{t('FILTER_BY_KEYWORDS')}</Text>
        <Icon
          as={FontAwesome}
          name="plus"
          size={6}
          color={blackColor}
          style={styles.activeFilterClose}
        />
      </HStack>
      <ActiveKeywordFilters />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
});
