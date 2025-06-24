import { StyleSheet } from "react-native";
import { useState } from "react";
import { View } from "native-base";

import { addStringFilter } from "../../redux/Dispatch/actions";
import { useDispatch } from "react-redux";
import ActiveKeywordFilters from "./components/ActiveKeywordFilters";
import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import SearchInput from "../../components/SearchInput";


export default function KeywordsFilters() {
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      dispatch(addStringFilter(searchQuery));
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
        <ActiveKeywordFilters />
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
