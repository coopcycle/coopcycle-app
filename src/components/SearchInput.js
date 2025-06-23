import { Box, Icon } from 'native-base';
import { StyleSheet, TextInput } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


export default function SearchInput({
  onChangeText,
  onSubmitEditing,
  placeholder="Search",
  value,
  style,
  ...props
}) {
  return (
    <Box style={[styles.searchContainer, style]} {...props}>
      <Icon
        as={FontAwesome}
        name="search"
        size={6}
        color="#000000"
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor="#000000"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
      />
    </Box>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    borderRadius: 20.5,
    flexDirection: 'row',
    height: 40,
    paddingLeft: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    color: '#000000',
    flex: 1,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    height: '100%',
    marginLeft: -30,
    paddingRight: 30,
    textAlign: 'center',
  },
});
