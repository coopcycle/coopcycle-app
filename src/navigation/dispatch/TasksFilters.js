import { FlatList, StyleSheet } from 'react-native';
import { HStack, Switch, Text, View } from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  clearTasksFilter,
  filterTasks,
  selectAreDoneTasksHidden,
  selectIsPolylineOn,
  selectTasksChangedAlertSound,
  setPolylineOn,
  setTasksChangedAlertSound,
} from '../../redux/Courier';
import {
  filterHasIncidents,
  filterStatusDone,
} from '../../redux/logistics/filters';
import { selectAreIncidentsHidden } from '../../redux/Courier/taskSelectors';
import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import ItemSeparatorComponent from '../../components/ItemSeparator';

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
});

const SettingsItemInner = ({ item }) => (
  <HStack alignItems="center" justifyContent="space-between" py="3">
    <HStack alignItems="center">
      <Text>{item.label}</Text>
    </HStack>
    {!item.onPress && (
      <Switch onToggle={item.onToggle} isChecked={item.isChecked} />
    )}
  </HStack>
);

export default function TasksFilters({
  ...props
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const areDoneTasksHidden = useSelector(selectAreDoneTasksHidden);
  const areIncidentsHidden = useSelector(selectAreIncidentsHidden);
  const tasksChangedAlertSound = useSelector(selectTasksChangedAlertSound);
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

  function togglePolylineOn(enabled) {
    dispatch(setPolylineOn(enabled));
  }

  const sections = [
    {
      label: t('HIDE_DONE_TASKS'),
      onToggle: () => toggleDisplayDone(areDoneTasksHidden),
      isChecked: areDoneTasksHidden,
    },
    {
      label: t('HIDE_INCIDENTS_TASKS'),
      onToggle: () => toggleDisplayIncidents(areIncidentsHidden),
      isChecked: areIncidentsHidden,
    },
    {
      label: t('TASKS_CHANGED_ALERT_SOUND'),
      onToggle: toggleTasksChangedAlertSound,
      isChecked: tasksChangedAlertSound,
    },
    {
      label: t('TASKS_SHOW_POLYLINE'),
      onToggle: togglePolylineOn,
      isChecked: isPolylineOn,
    },
  ];

  const renderItem = ({item, index}) => (
    <SettingsItemInner item={item} />
  );

  return (
    <BasicSafeAreaView>
      <View style={styles.view}>
        <FlatList
          data={sections}
          keyExtractor={(item, index) => item.label}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
        />
      </View>
    </BasicSafeAreaView>
  )
}
