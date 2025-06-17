import { FlatList, StyleSheet } from 'react-native';
import { HStack, Switch, Text, View } from 'native-base';
import { useTranslation } from 'react-i18next';

import { mediumGreyColor } from '../../styles/common';
import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import ItemSeparatorComponent from '../../components/ItemSeparator';

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    // backgroundColor: mediumGreyColor,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  // text: {
  //   color: '#000000',
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
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

  const sections = [
    {
      label: t('HIDE_DONE_TASKS'),
      // onToggle: () => toggleDisplayDone(areDoneTasksHidden),
      // isChecked: areDoneTasksHidden,
    },
    {
      label: t('HIDE_INCIDENTS_TASKS'),
      // onToggle: () => toggleDisplayIncidens(areIncidentsHidden),
      // isChecked: areIncidentsHidden,
    },
    {
      label: t('TASKS_CHANGED_ALERT_SOUND'),
      // onToggle: toggleTasksChangedAlertSound,
      // isChecked: tasksChangedAlertSound,
    },
    {
      label: t('TASKS_SHOW_POLYLINE'),
      // onToggle: togglePolylineOn,
      // isChecked: isPolylineOn,
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
