import { Icon, SearchIcon } from '@/components/ui/icon';
import { StyleSheet, TextInput, View } from 'react-native';
import { blackColor, darkGreyColor } from '../styles/common';

export default function SearchInput({
  onChangeText,
  onSubmitEditing,
  placeholder = 'Search',
  value,
  style,
  ...props
}) {
  return (
    <View style={[styles.searchContainer, style]} {...props}>
      <Icon
        as={SearchIcon}
        name="search"
        size="xl"
        style={[styles.searchIcon, {color: blackColor}]}
      />
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder}
        placeholderTextColor={darkGreyColor}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="search"
        testID="searchTextInput"
      />
    </View>
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
