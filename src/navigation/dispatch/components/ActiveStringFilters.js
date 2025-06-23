import { Box, HStack, Icon, Text } from "native-base";
import { StyleSheet, TouchableHighlight } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ColorHash from 'color-hash';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { removeStringFilter } from "../../../redux/Dispatch/actions";
import { selectStringFilters } from "../../../redux/Dispatch/selectors";
import { whiteColor } from "../../../styles/common";


export default function ActiveStringFilters({
  style,
  ...props
}) {
  const activeFilters = useSelector(selectStringFilters);

  return (
    <Box style={[style, styles.container]} {...props}>
      {activeFilters.map(filter => (
        <ActiveFilter filter={filter} />
      ))}
    </Box>
  );
}

const colorHash = new ColorHash();

function ActiveFilter({
  filter,
}) {
  const dispatch = useDispatch();

  const isNegative = filter.slice(0, 1) === '-';

  const color = colorHash.hex(filter);
  console.log({color});

  // TODO: no remove item if pressed from Filters
  const removeFilter = () => {
    dispatch(removeStringFilter(filter));
  }

  return (
    <TouchableHighlight onPress={removeFilter}>
      <HStack
        style={styles.activeFilter}
        backgroundColor={isNegative ? whiteColor : color}
      >
        <Text
          style={styles.activeFilterLabel}
          color={isNegative ? color : whiteColor}
        >
          {filter}
        </Text>
        <Icon
          as={FontAwesome}
          name="times"
          size={4}
          color={isNegative ? color : whiteColor}
          style={styles.activeFilterClose}
        />
      </HStack>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: whiteColor,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  activeFilter: {

  },
  activeFilterLabel: {
  },
  activeFilterClose: {

  }
});
