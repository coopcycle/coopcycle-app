import { Icon, SearchIcon } from '@/components/ui/icon';
import { StyleSheet, TextInput, View, useColorScheme } from 'react-native';
import { blackColor, darkGreyColor } from '../styles/common';

export default function SearchInput({
  onChangeText,
  onSubmitEditing,
  placeholder = 'Search',
  value,
  style,
  onFocus,
  onBlur,
  ...props
}) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  return (
    <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#2A2A2A' : '#EFEFEF' }, style]} {...props}>
      <Icon
        as={SearchIcon}
        name="search"
        size="xl"
        style={[styles.searchIcon, { color: isDarkMode ? '#FFFFFF' : blackColor }]}
      />
      <TextInput
        style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}
        placeholder={placeholder}
        placeholderTextColor={isDarkMode ? '#888888' : darkGreyColor}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        onBlur={onBlur}
        returnKeyType="search"
        testID="searchTextInput"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    alignItems: 'center',
    borderRadius: 20.5,
    flexDirection: 'row',
    height: 40,
    paddingLeft: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 14,
    height: '100%',
    marginLeft: -30,
    paddingRight: 30,
    textAlign: 'center',
  },
});
