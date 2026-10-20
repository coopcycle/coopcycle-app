import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { Badge, BadgeText } from '@/components/ui/badge';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';

import ItemSeparator from '../../components/ItemSeparator';
import { soloTagState } from './tagFilters';
import {
  clearTasksFilter,
  filterTasks,
  selectAreDoneTasksHidden,
  selectIsTagHidden,
  selectTags,
  selectTaskFilters,
} from '../../redux/Courier';
import { selectAreIncidentsHidden } from '../../redux/Courier/taskSelectors';
import {
  filterByTag,
  filterHasIncidents,
  filterStatusDone,
  filterUntagged,
} from '../../redux/logistics/filters';
import { DoneIcon, IncidentIcon } from '../task/styles/common';
import {
  useBackgroundColor,
  useColorModeValue,
  useIconColor,
} from '../../styles/theme';
import { whiteColor } from '../../styles/common';

// The sheet is meant to be filtered against the results showing behind it, so
// it never grows past half the screen, however many tags the courier has.
const MAX_SHEET_HEIGHT = Dimensions.get('window').height * 0.5;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  // iOS draws the switch with its own trailing inset; this keeps every switch in
  // the sheet on the same right edge.
  switch: {
    marginRight: Platform.OS === 'ios' ? 12 : 0,
  },
  tag: {
    borderWidth: 0,
  },
  tagHidden: {
    opacity: 0.4,
  },
});

const TasksFilterSheetContext = createContext<{
  openFilters: () => void;
} | null>(null);

export function useTasksFilterSheet() {
  return useContext(TasksFilterSheetContext);
}

function FilterRow({ icon, label, isChecked, onToggle }) {
  const iconColor = useIconColor();

  return (
    <View style={styles.row}>
      <HStack className="items-center">
        <Icon size={16} className="mr-2" as={icon} color={iconColor} />
        <Text>{label}</Text>
      </HStack>
      <Switch size="sm" onValueChange={onToggle} value={isChecked} style={styles.switch} />
    </View>
  );
}

function TagRow({ tag, isShown, onToggle, onSolo }) {
  return (
    <View style={styles.row}>
      {/*
      Long-pressing the badge solos the tag — the quickest way to get down to a
      single tag when there are several, without flicking every other switch.
      */}
      <Pressable onLongPress={onSolo}>
        <Badge
          size="md"
          className="rounded"
          style={[
            styles.tag,
            { backgroundColor: tag.color },
            // A hidden tag reads as filtered out at a glance, not only from the
            // switch next to it.
            !isShown && styles.tagHidden,
          ]}>
          <BadgeText style={{ color: whiteColor }}>{tag.name}</BadgeText>
        </Badge>
      </Pressable>
      <Switch size="sm" onValueChange={onToggle} value={isShown} style={styles.switch} />
    </View>
  );
}

// The sheet's content is mounted at the portal host rather than where it is
// written, so it subscribes to the store itself instead of being handed values
// by the provider: that way a filter change re-renders it in place, and it also
// keeps the provider (and with it the whole navigator it wraps) from
// re-rendering on every toggle.
function TasksFilterSheetContent() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const store = useStore();
  const insets = useSafeAreaInsets();

  const areDoneTasksHidden = useSelector(selectAreDoneTasksHidden);
  const areIncidentsHidden = useSelector(selectAreIncidentsHidden);
  const tags = useSelector(selectTags);
  const isTagHidden = useSelector(selectIsTagHidden);

  const toggleFilter = useCallback(
    (filter, isActive) =>
      dispatch(isActive ? clearTasksFilter(filter) : filterTasks(filter)),
    [dispatch],
  );

  // Long-pressing an already soloed tag brings every tag back, so the gesture
  // is its own way out. Only the tag rules are touched, so the done and
  // incident filters above are left as they were.
  const soloTag = useCallback(
    name => {
      // Read the filters as they are at press time: the handler was attached by
      // an earlier render, and this sheet is mounted through a portal, so the
      // values that render captured are not a safe basis for the sequence below.
      const state = store.getState();
      const filters = selectTaskFilters(state);
      const tagNames = selectTags(state).map(tag => tag.name);
      const hiddenTagNames = filters
        .filter(filter => filter.tags !== undefined)
        .map(filter => filter.tags);
      const isUntaggedHidden = filters.some(filter => filter.untagged);

      const target = soloTagState(
        tagNames,
        hiddenTagNames,
        isUntaggedHidden,
        name,
      );

      tagNames.forEach(tagName => {
        const shouldHide = target.hiddenTags.includes(tagName);

        if (shouldHide === hiddenTagNames.includes(tagName)) {
          return;
        }

        dispatch(
          shouldHide
            ? filterTasks(filterByTag(tagName))
            : clearTasksFilter(filterByTag(tagName)),
        );
      });

      if (target.isUntaggedHidden !== isUntaggedHidden) {
        dispatch(
          target.isUntaggedHidden
            ? filterTasks(filterUntagged)
            : clearTasksFilter(filterUntagged),
        );
      }
    },
    [dispatch, store],
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={[
        styles.content,
        // The sheet sits on the bottom edge, so its own padding has to clear
        // the home indicator rather than rely on a wrapper.
        { paddingBottom: insets.bottom + 24 },
      ]}>
      <Heading size="md" className="pb-1">
        {t('TASKS_FILTER')}
      </Heading>
      <FilterRow
        icon={DoneIcon}
        label={t('HIDE_DONE_TASKS')}
        isChecked={areDoneTasksHidden}
        onToggle={() => toggleFilter(filterStatusDone, areDoneTasksHidden)}
      />
      <ItemSeparator />
      <FilterRow
        icon={IncidentIcon}
        label={t('HIDE_INCIDENTS_TASKS')}
        isChecked={areIncidentsHidden}
        onToggle={() => toggleFilter(filterHasIncidents, areIncidentsHidden)}
      />
      <Heading size="sm" className="mt-3">
        {t('FILTER_BY_TAGS')}
      </Heading>
      {/*
      The tags come from the tasks of the selected day, so there is nothing
      to list on a day whose tasks carry none. We still show the section, so
      an empty tag list doesn't read as a missing filter.
      */}
      {tags.length === 0 ? (
        <Text className="py-2 opacity-60">{t('NO_TAGS_TO_FILTER')}</Text>
      ) : (
        tags.map((tag, index) => (
          <React.Fragment key={tag.name}>
            {index > 0 && <ItemSeparator />}
            {/*
            Unlike the rows above, a tag switch is on when the tag is *shown*,
            so every tag starts enabled when no tag filter is set.
            */}
            <TagRow
              tag={tag}
              isShown={!isTagHidden(tag.name)}
              onToggle={() =>
                toggleFilter(filterByTag(tag.name), isTagHidden(tag.name))
              }
              onSolo={() => soloTag(tag.name)}
            />
          </React.Fragment>
        ))
      )}
    </BottomSheetScrollView>
  );
}

export function TasksFilterSheetProvider({ children }) {
  const sheetRef = useRef<BottomSheetModal>(null);

  const backgroundColor = useBackgroundColor();
  const indicatorColor = useColorModeValue('#CBD5E0', '#4A5568');

  const openFilters = useCallback(() => sheetRef.current?.present(), []);
  const contextValue = useMemo(() => ({ openFilters }), [openFilters]);

  const renderBackdrop = useCallback(
    props => (
      // A light backdrop only: the point of this sheet is to keep the filtered
      // tasks visible behind it while the filters are being changed.
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.2}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <TasksFilterSheetContext.Provider value={contextValue}>
      {children}
      <BottomSheetModal
        ref={sheetRef}
        enablePanDownToClose
        enableDynamicSizing
        maxDynamicContentSize={MAX_SHEET_HEIGHT}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: indicatorColor }}>
        <TasksFilterSheetContent />
      </BottomSheetModal>
    </TasksFilterSheetContext.Provider>
  );
}
