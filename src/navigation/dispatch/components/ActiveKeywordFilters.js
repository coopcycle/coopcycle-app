import { Box, HStack, Icon, Text } from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import ColorHash from 'color-hash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { removeStringFilter } from "../../../redux/Dispatch/actions";
import { selectKeywordFilters } from "../../../redux/Dispatch/selectors";
import { whiteColor } from "../../../styles/common";


export default function ActiveKeywordFilters({
  style,
  ...props
}) {
  const keywordFilters = useSelector(selectKeywordFilters);

  return (
    <Box style={[style, styles.container]} {...props}>
      {keywordFilters.length === 0
        ? <NoFiltersPlaceholder />
        : <Box style={styles.activeFiltersContainer}>
            {keywordFilters.map(filter => (
              <ActiveFilter filter={filter} />
            ))}
          </Box>
      }
    </Box>
  );
}

function NoFiltersPlaceholder() {
  const { t } = useTranslation();

  return (
    <Text style={styles.noFiltersLabel}>
      {t('NO_KEYWORDS_FILTERS')}
    </Text>
  );
}

const colorHash = new ColorHash();

function ActiveFilter({
  filter,
}) {
  const dispatch = useDispatch();

  const isNegative = filter.keyword.slice(0, 1) === '-';

  const color = colorHash.hex(filter.keyword);
  const mainColor = isNegative ? color : whiteColor;
  const secondaryColor = isNegative ? whiteColor : color;

  const removeFilter = () => {
    dispatch(removeStringFilter(filter.keyword));
  }

  return (
    <TouchableOpacity onPress={removeFilter}>
      <HStack
        style={styles.activeFilter}
        backgroundColor={secondaryColor}
        borderColor={color}
      >
        <Text
          style={styles.activeFilterLabel}
          color={mainColor}
          borderRightColor={mainColor}
        >
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
  }
});
