import { Box, HStack, Icon, Text } from 'native-base';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ColorHash from 'color-hash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { isKeywordFilterNegative } from '../../../redux/logistics/utils';
import { removeKeywordFilter } from '../../../redux/Dispatch/keywordFiltersSlice';
import { selectKeywordFilters } from '../../../redux/Dispatch/selectors';
import { whiteColor } from '../../../styles/common';

export default function ActiveKeywordFilters({ style, ...props }) {
  const keywordFilters = useSelector(selectKeywordFilters);

  return (
    <Box style={[style, styles.container]} {...props}>
      {keywordFilters.length === 0 ? (
        <NoFiltersPlaceholder />
      ) : (
        <Box style={styles.activeFiltersContainer}>
          {keywordFilters.map((filter, index) => {
            const key = `active-filter-${index}`;
            return <ActiveFilter filter={filter} key={key} testID={key} />;
          })}
        </Box>
      )}
    </Box>
  );
}

function NoFiltersPlaceholder() {
  const { t } = useTranslation();

  return <Text style={styles.noFiltersLabel}>{t('NO_KEYWORDS_FILTERS')}</Text>;
}

const colorHash = new ColorHash();

function ActiveFilter({ filter, ...props }) {
  const dispatch = useDispatch();

  const isNegative = isKeywordFilterNegative(filter);

  const color = colorHash.hex(filter.keyword);
  const mainColor = isNegative ? color : whiteColor;
  const secondaryColor = isNegative ? whiteColor : color;

  const removeFilter = () => {
    dispatch(removeKeywordFilter(filter.keyword));
  };

  return (
    <TouchableOpacity onPress={removeFilter} {...props}>
      <HStack
        style={styles.activeFilter}
        backgroundColor={secondaryColor}
        borderColor={color}>
        <Text
          style={styles.activeFilterLabel}
          color={mainColor}
          borderRightColor={mainColor}>
          {filter.keyword}
        </Text>
        <Icon
          as={FontAwesome}
          name="times"
          size={4}
          color={mainColor}
          style={styles.activeFilterClose}
        />
      </HStack>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: whiteColor,
    borderRadius: 28,
    justifyContent: 'center',
    minHeight: 56,
  },
  noFiltersLabel: {
    color: '#8B8B8B',
  },
  activeFiltersContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 16,
  },
  activeFilter: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
  },
  activeFilterLabel: {
    borderRightWidth: 1,
    paddingHorizontal: 6,
  },
  activeFilterClose: {
    marginLeft: 6,
  },
});
