import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { addStringFilter } from "../../redux/Dispatch/actions";
import { greenColor, whiteColor } from "../../styles/common";
import { useDispatch } from "react-redux";
import ActiveKeywordFilters from "./components/ActiveKeywordFilters";
import BasicSafeAreaView from "../../components/BasicSafeAreaView";
import SearchInput from "../../components/SearchInput";


export default function KeywordsFilters() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      dispatch(addStringFilter(searchQuery));
      setSearchQuery('');
    }
  };

  const goToAllTasks = () => {
    navigation.navigate('DispatchHome');
  };

  return (
    <BasicSafeAreaView>
      <View style={styles.view}>
        <SearchInput
          style={styles.searchInput}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          placeholder={t('KEYWORD_FILTERS_SEARCH_PLACEHOLDER')}
          value={searchQuery}
        />
        <ActiveKeywordFilters />
      </View>
      <TouchableOpacity
        style={styles.goToAllTasksButton}
        onPress={goToAllTasks}
      >
        <Text style={styles.buttonText}>
          {t('KEYWORD_FILTERS_APPLY_FILTERS')}
        </Text>
      </TouchableOpacity>
    </BasicSafeAreaView>
  )
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'stretch',
    flex: 1,
    flexDirection: 'column',
    gap: 20,
    justifyContent: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 14,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
  },
  goToAllTasksButton: {
    alignItems: 'center',
    backgroundColor: greenColor,
    padding: 20,
  },
  buttonText: {
    color: whiteColor,
  },
});
