import { StyleSheet } from "react-native";
import { useState } from "react";
import { View } from "native-base";

import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import SearchInput from "../../components/SearchInput";


export default function KeywordsFilters() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setSearchQuery('');
    }
  };

  return (
    <BasicSafeAreaView>
      <View style={styles.view}>
        <SearchInput
          style={styles.searchInput}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          placeholder="Search your filters..."
          value={searchQuery}
        />
      </View>
    </BasicSafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingHorizontal: 14,
    gap: 20,
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
});
