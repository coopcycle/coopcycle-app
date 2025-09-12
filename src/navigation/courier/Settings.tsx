import { Icon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { SectionList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import ItemSeparator from '../../components/ItemSeparator';
import { Power, Route, Signature, Tag, Volume } from 'lucide-react-native'

import {
  clearTasksFilter,
  filterTasks,
  selectAreDoneTasksHidden,
  selectAreFailedTasksHidden,
  selectIsPolylineOn,
  selectKeepAwake,
  selectSignatureScreenFirst,
  selectTagNames,
  selectTasksChangedAlertSound,
  setKeepAwake,
  setPolylineOn,
  setSignatureScreenFirst,
  setTasksChangedAlertSound,
} from '../../redux/Courier';
import { DoneIcon, IncidentIcon } from '../task/styles/common';
import {
  filterHasIncidents,
  filterStatusDone,
  filterStatusFailed,
} from '../../redux/logistics/filters';
import { selectAreIncidentsHidden } from '../../redux/Courier/taskSelectors';

const SettingsItemInner = ({ item }) => (
  <HStack className="items-center justify-between py-3">
    <HStack className="items-center">
      <Icon size={16} className="mr-2" as={item.icon} />
      <Text>{item.label}</Text>
    </HStack>
    {!item.onPress && (
      <Switch onToggle={item.onToggle} value={item.isChecked} />
    )}
    {item.onPress && <Icon as={ArrowRightIcon} />}
  </HStack>
);

const SettingsItem = ({ item }) => {
  if (item.onPress) {
    return (
      <TouchableOpacity onPress={item.onPress}>
        <SettingsItemInner item={item} />
      </TouchableOpacity>
    );
  }

  return <SettingsItemInner item={item} />;
};

const Settings = ({
  navigation,
  areDoneTasksHidden,
  areFailedTasksHidden,
  tasksChangedAlertSound,
  toggleDisplayDone,
  toggleDisplayFailed,
  toggleDisplayIncidens,
  areIncidentsHidden,
  toggleTasksChangedAlertSound,
  togglePolylineOn,
  setKeepAwakeDisabled,
  setSignatureScreenFirst,
  tags,
  isKeepAwakeDisabled,
  isPolylineOn,
  signatureScreenFirst,
  t,
}) => {
  const sections = [
    {
      title: t('TASKS_FILTER'),
      data: [
        {
          icon: DoneIcon,
          label: t('HIDE_DONE_TASKS'),
          onToggle: () => toggleDisplayDone(areDoneTasksHidden),
          isChecked: areDoneTasksHidden,
        },
        {
          icon: IncidentIcon,
          label: t('HIDE_INCIDENTS_TASKS'),
          onToggle: () => toggleDisplayIncidens(areIncidentsHidden),
          isChecked: areIncidentsHidden,
        },
        {
          icon: Tag,
          label: t('HIDE_TASKS_TAGGED_WITH'),
          onPress: () => navigation.navigate('CourierSettingsTags'),
        },
        {
          icon: Volume,
          label: t('TASKS_CHANGED_ALERT_SOUND'),
          onToggle: toggleTasksChangedAlertSound,
          isChecked: tasksChangedAlertSound,
        },
        {
          icon: Route,
          label: t('TASKS_SHOW_POLYLINE'),
          onToggle: togglePolylineOn,
          isChecked: isPolylineOn,
        },
      ],
    },
    {
      title: t('SETTINGS'),
      data: [
        {
          icon: Signature,
          label: t('SIGNATURE_SCREEN_FIRST'),
          onToggle: setSignatureScreenFirst,
          isChecked: signatureScreenFirst,
        },
        {
          icon: Power,
          label: t('SETTING_KEEP_AWAKE'),
          onToggle: setKeepAwakeDisabled,
          isChecked: isKeepAwakeDisabled,
        },
      ],
    },
  ];

  return (
    <Box className="p-2">
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `setting-${index}`}
        renderItem={({ item }) => <SettingsItem item={item} />}
        ItemSeparatorComponent={ItemSeparator}
        renderSectionHeader={({ section: { title } }) => (
          <Heading size="md">{title}</Heading>
        )}
      />
    </Box>
  );
};

function mapStateToProps(state) {
  return {
    tags: selectTagNames(state),
    areDoneTasksHidden: selectAreDoneTasksHidden(state),
    areFailedTasksHidden: selectAreFailedTasksHidden(state),
    areIncidentsHidden: selectAreIncidentsHidden(state),
    tasksChangedAlertSound: selectTasksChangedAlertSound(state),
    isKeepAwakeDisabled: !selectKeepAwake(state),
    isPolylineOn: selectIsPolylineOn(state),
    signatureScreenFirst: selectSignatureScreenFirst(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDisplayDone: hidden =>
      dispatch(
        hidden
          ? clearTasksFilter(filterStatusDone)
          : filterTasks(filterStatusDone),
      ),
    toggleDisplayFailed: hidden =>
      dispatch(
        hidden
          ? clearTasksFilter(filterStatusFailed)
          : filterTasks(filterStatusFailed),
      ),
    toggleDisplayIncidens: hidden =>
      dispatch(
        hidden
          ? clearTasksFilter(filterHasIncidents)
          : filterTasks(filterHasIncidents),
      ),
    toggleTasksChangedAlertSound: enabled =>
      dispatch(setTasksChangedAlertSound(enabled)),
    togglePolylineOn: enabled => dispatch(setPolylineOn(enabled)),
    setKeepAwakeDisabled: disabled => dispatch(setKeepAwake(!disabled)),
    setSignatureScreenFirst: first => dispatch(setSignatureScreenFirst(first)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(Settings));
