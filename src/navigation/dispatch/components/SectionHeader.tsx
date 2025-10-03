import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { TouchableOpacity, View } from 'react-native';

import { useBackgroundHighlightColor } from '../../../styles/theme';
import { darkGreyColor, whiteColor } from '../../../styles/common';
import FAIcon from '@/src/components/Icon';

export function SectionHeader({
  section,
  collapsedSections,
  setCollapsedSections,
}) {
  const { t } = useTranslation();

  const bgHighlightColor = useBackgroundHighlightColor();

  // Disabled animation for now..!
  // if (Platform.OS === 'android') {
  //   UIManager.setLayoutAnimationEnabledExperimental(true);
  // }
  const handleToggle = title => {
    // Disabled animation for now..!
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCollapsedSections(() => {
      const next = new Set(collapsedSections);
      next[next.has(title) ? 'delete' : 'add'](title);
      return next;
    });
  };

  return (
    <View style={{ backgroundColor: bgHighlightColor }}>
      <TouchableOpacity
        onPress={() => handleToggle(section.title)}
        activeOpacity={0.5}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 8,
          paddingVertical: 4,
          backgroundColor: whiteColor,
          margin: 4,
          borderRadius: 5,
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              backgroundColor: section.backgroundColor,
              borderRadius: 4,
              marginEnd: 8,
              padding: 4,
            }}>
            <Text
              style={{
                color: section.textColor,
              }}>
              {section.title}
            </Text>
          </View>
          <Text style={{ color: darkGreyColor }}>
            {section.isUnassignedTaskList
              ? `${section.ordersCount}   (${section.tasksCount} ${t(
                  'TASKS',
                ).toLowerCase()})`
              : section.tasksCount}
          </Text>
        </View>
        {section.tasksCount === 0 ? null : (
          <FAIcon
            name={
              collapsedSections.has(section.title)
                ? 'chevron-down'
                : 'chevron-up'
            }
            testID={`${section.id}:toggler`}
            color={darkGreyColor}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
