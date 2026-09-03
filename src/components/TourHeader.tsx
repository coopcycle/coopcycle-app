import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/ui/text';
import FAIcon from './Icon';
import { darkGreyColor } from '../styles/common';
import { TourSummary } from '../utils/tours';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    // Leaves room for the counter, so a long tour name ellipsizes instead of
    // pushing it off screen.
    flexShrink: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    marginStart: 8,
    flexShrink: 1,
  },
  counter: {
    color: darkGreyColor,
    marginEnd: 8,
  },
});

type Props = {
  tour: TourSummary;
  tasksCount: number;
  completedCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  testID?: string;
};

/**
 * The header row of a tour in the courier's task list.
 *
 * Display only: the tour groups its tasks, but each task keeps its own swipe
 * actions and is completed individually, so there is no action here beyond
 * folding the group.
 */
export default function TourHeader({
  tour,
  tasksCount,
  completedCount,
  isExpanded,
  onToggle,
  testID,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.5}
      accessibilityRole="button"
      accessibilityState={{ expanded: isExpanded }}
      accessibilityLabel={`${tour.name} — ${completedCount}/${tasksCount}`}
      testID={testID}
      style={styles.container}>
      <View style={styles.left}>
        <FAIcon name="route" color={darkGreyColor} size={16} />
        <Text numberOfLines={1} style={styles.name}>
          {tour.name}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.counter}>
          {completedCount}/{tasksCount}
        </Text>
        <FAIcon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          color={darkGreyColor}
          size={14}
        />
      </View>
    </TouchableOpacity>
  );
}
