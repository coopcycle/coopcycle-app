import { Icon, CloseIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ColorHash from 'color-hash';
import { Badge, BadgeText, BadgeIcon } from '@/components/ui/badge';

import { isKeywordFilterNegative } from '../../../redux/logistics/utils';
import { removeKeywordFilter } from '../../../redux/Dispatch/keywordFiltersSlice';
import { selectKeywordFilters } from '../../../redux/Dispatch/selectors';
import { whiteColor } from '../../../styles/common';

export default function ActiveKeywordFilters({ style, ...props }) {
  const keywordFilters = useSelector(selectKeywordFilters);
  const isDark = useColorScheme() === 'dark';

  return (
    <Box
      style={[
        style,
        styles.container,
        { backgroundColor: isDark ? '#1E1E1E' : whiteColor }
      ]}
      {...props}
    >
      {keywordFilters.length === 0 ? (
        <NoFiltersPlaceholder isDark={isDark} />
      ) : (
        <Box style={styles.activeFiltersContainer}>
          {keywordFilters.map((filter, index) => {
            const key = `active-filter-${index}`;
            return <ActiveFilter filter={filter} key={key} testID={key} isDark={isDark} />;
          })}
        </Box>
      )}
    </Box>
  );
}

function NoFiltersPlaceholder({ isDark }) {
  const { t } = useTranslation();
  return (
    <Text style={{ color: isDark ? '#AAAAAA' : '#8B8B8B' }}>
      {t('NO_KEYWORDS_FILTERS')}
    </Text>
  );
}

const colorHash = new ColorHash();

function ActiveFilter({ filter, isDark, ...props }) {
  const dispatch = useDispatch();

  const isNegative = isKeywordFilterNegative(filter);
  const color = colorHash.hex(filter.keyword);
  const mainColor = isNegative ? color : whiteColor;
  const background = isNegative ? whiteColor : color;

  return (
    <TouchableOpacity onPress={() => dispatch(removeKeywordFilter(filter.keyword))}>
      <Badge
        variant="solid"
        {...props}
        style={[
          styles.badge,
          {
            backgroundColor: background,
            borderColor: color,
            borderWidth: 1,
          },
        ]}
      >
        <BadgeText style={styles.badgeText}>
          {filter.keyword}
        </BadgeText>
        <BadgeIcon
          as={CloseIcon}
          style={{
            color: mainColor,
            marginLeft: 4,
          }}
        />
      </Badge>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 28,
    justifyContent: 'center',
    minHeight: 56,
  },
  activeFiltersContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: "white",
    fontWeight: '500',
    fontSize: 12,
    paddingRight: 4,
    borderRightWidth: 1,
    borderRightColor: whiteColor,
  }
});
