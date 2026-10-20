import { Icon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { FlatList, Platform, useColorScheme } from 'react-native';
import { connect } from 'react-redux';
import ItemSeparator from '../../components/ItemSeparator';
import { Power, Route, Signature, Volume } from 'lucide-react-native'

import {
  selectIsPolylineOn,
  selectKeepAwake,
  selectSignatureScreenFirst,
  selectTasksChangedAlertSound,
  setKeepAwake,
  setPolylineOn,
  setSignatureScreenFirst,
  setTasksChangedAlertSound,
} from '../../redux/Courier';

const SettingsItem = ({ item }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const iconColor = isDark ? '#FFFFFF' : '#000000';

  return (
    <HStack className="items-center justify-between py-3">
      <HStack className="items-center">
        <Icon size={16} className="mr-2" as={item.icon} color={iconColor} />
        <Text>{item.label}</Text>
      </HStack>

      <Switch
        onValueChange={item.onToggle}
        value={item.isChecked}
        style={{
          marginRight: Platform.OS === 'ios' ? 12 : 0,
        }}
      />
    </HStack>
  );
};

const Settings = ({
  tasksChangedAlertSound,
  toggleTasksChangedAlertSound,
  togglePolylineOn,
  setKeepAwakeDisabled,
  setSignatureScreenFirst,
  isKeepAwakeDisabled,
  isPolylineOn,
  signatureScreenFirst,
  t,
}) => {
  const items = [
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
  ];

  return (
    <Box className="p-2">
      <FlatList
        data={items}
        keyExtractor={(item, index) => `setting-${index}`}
        renderItem={({ item }) => <SettingsItem item={item} />}
        ItemSeparatorComponent={ItemSeparator}
      />
    </Box>
  );
};

function mapStateToProps(state) {
  return {
    tasksChangedAlertSound: selectTasksChangedAlertSound(state),
    isKeepAwakeDisabled: !selectKeepAwake(state),
    isPolylineOn: selectIsPolylineOn(state),
    signatureScreenFirst: selectSignatureScreenFirst(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
