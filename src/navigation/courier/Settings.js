import { Box, HStack, Heading, Icon, Switch, Text } from 'native-base';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { SectionList, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import ItemSeparator from '../../components/ItemSeparator';

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
import { doneIconName, failedIconName } from '../task/styles/common';

const SettingsItemInner = ({ item }) => (
  <HStack alignItems="center" justifyContent="space-between" py="3">
    <HStack alignItems="center">
      <Icon size="sm" mr="1" as={FontAwesome} name={item.icon} />
      <Text>{item.label}</Text>
    </HStack>
    {!item.onPress && (
      <Switch onToggle={item.onToggle} isChecked={item.isChecked} />
    )}
    {item.onPress && <Icon size="sm" as={FontAwesome} name="arrow-right" />}
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
          icon: doneIconName,
          label: t('HIDE_DONE_TASKS'),
          onToggle: () => toggleDisplayDone(areDoneTasksHidden),
          isChecked: areDoneTasksHidden,
        },
        {
          icon: failedIconName,
          label: t('HIDE_FAILED_TASKS'),
          onToggle: () => toggleDisplayFailed(areFailedTasksHidden),
          isChecked: areFailedTasksHidden,
        },
        {
          icon: 'tag',
          label: t('HIDE_TASKS_TAGGED_WITH'),
          onPress: () => navigation.navigate('CourierSettingsTags'),
        },
        {
          icon: 'volume-up',
          label: t('TASKS_CHANGED_ALERT_SOUND'),
          onToggle: toggleTasksChangedAlertSound,
          isChecked: tasksChangedAlertSound,
        },
        {
          icon: 'map-signs',
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
          icon: 'hand-pointer-o',
          label: t('SIGNATURE_SCREEN_FIRST'),
          onToggle: setSignatureScreenFirst,
          isChecked: signatureScreenFirst,
        },
        {
          icon: 'power-off',
          label: t('SETTING_KEEP_AWAKE'),
          onToggle: setKeepAwakeDisabled,
          isChecked: isKeepAwakeDisabled,
        },
      ],
    },
  ];

  return (
    <Box p="2">
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
          ? clearTasksFilter({ status: 'DONE' })
          : filterTasks({ status: 'DONE' }),
      ),
    toggleDisplayFailed: hidden =>
      dispatch(
        hidden
          ? clearTasksFilter({ status: 'FAILED' })
          : filterTasks({ status: 'FAILED' }),
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
