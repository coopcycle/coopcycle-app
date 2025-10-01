import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { addKeywordFilter } from '../../redux/Dispatch/keywordFiltersSlice';
import { greenColor, whiteColor } from '../../styles/common';
import { useDispatch } from 'react-redux';
import ActiveKeywordFilters from './components/ActiveKeywordFilters';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';
import SearchInput from '../../components/SearchInput';

export default function KeywordsFilters() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [keyword, setKeyword] = useState('');

  const handleSearchSubmit = () => {
    if (keyword.trim()) {
      dispatch(addKeywordFilter(keyword));
      setKeyword('');
    }
  };

  const goToAllTasks = () => {
    navigation.navigate('DispatchHome');
  };

  return (
    <BasicSafeAreaView>
      <View style={styles.view} testID="keywordsFilterView">
        <Text style={styles.searchExplanation}>
          {t('KEYWORD_FILTERS_SEARCH_EXPLANATION')}
        </Text>
        <SearchInput
          style={styles.searchInput}
          onChangeText={setKeyword}
          onSubmitEditing={handleSearchSubmit}
          placeholder=""
          value={keyword}
        />
        <ActiveKeywordFilters />
      </View>
      <TouchableOpacity
        style={styles.goToAllTasksButton}
        onPress={goToAllTasks}
        testID="keywordsFilterGoToAllTasksButton">
        <Text style={styles.buttonText}>
          {t('KEYWORD_FILTERS_APPLY_FILTERS')}
        </Text>
      </TouchableOpacity>
    </BasicSafeAreaView>
  );
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
  searchExplanation: {
    flexDirection: 'row',
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
