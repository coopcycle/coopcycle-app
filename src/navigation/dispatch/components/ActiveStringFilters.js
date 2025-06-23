import { Box, Text } from "native-base";
import { StyleSheet } from "react-native";
import { useSelector } from "react-redux";

import { selectStringFilters } from "../../../redux/Dispatch/selectors";


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

function ActiveFilter({
  filter
}) {
  return (
    <Text>{filter}</Text>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
