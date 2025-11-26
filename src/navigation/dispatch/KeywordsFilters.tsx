import { FlatList, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, View, useColorScheme } from 'react-native';
import { Text } from '@/components/ui/text';
import { useNavigation } from '@react-navigation/native';
import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { addKeywordFilter } from '../../redux/Dispatch/keywordFiltersSlice';
import { greenColor, whiteColor, greyColor } from '../../styles/common';
import { useDispatch } from 'react-redux';
import ActiveKeywordFilters from './components/ActiveKeywordFilters';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';
import SearchInput from '../../components/SearchInput';
import { useGetStoresQuery, useGetTagsQuery, useGetRestaurantsQuery } from '../../redux/api/slice';

export default function KeywordsFilters() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [keyword, setKeyword] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const { data: stores = [] } = useGetStoresQuery();
  const { data: restaurants = [] } = useGetRestaurantsQuery();
  const { data: tags = [] } = useGetTagsQuery();

  // Normalize string for search
  const normalizeString = str =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // Filter stores based on keyword
  const filteredItems = useMemo(() => {
    if (!isFocused) return [];

    const combined = [
      ...stores.map(s => ({ type: 'store', name: s.name, id: s['@id'] })),
      ...restaurants.map(r => ({ type: 'restaurant', name: r.name, id: r['@id'] })),
      ...tags.map(t => ({ type: 'tag', name: t.name, id: t['@id'] })),
    ];
    const normalized = normalizeString(keyword);

    return combined
      .filter(item => normalizeString(item.name).includes(normalized))
  }, [keyword, stores, restaurants, tags, isFocused]);

  const handleSearchSubmit = () => {
    if (keyword.trim()) {
      dispatch(addKeywordFilter(keyword));
      setKeyword('');
    }
  };

  const handleSelect = (value) => {
    dispatch(addKeywordFilter(value));
    setKeyword('');
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const goToAllTasks = () => {
    navigation.navigate('DispatchHome');
  };

  return (
    <BasicSafeAreaView>
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
        setIsFocused(false);
      }}>
        <View style={styles.view} testID="keywordsFilterView">
          <Text style={[styles.searchExplanation, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>
            {t('KEYWORD_FILTERS_SEARCH_EXPLANATION')}
          </Text>
          <SearchInput
            style={[styles.searchInput, { backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF' }]}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearchSubmit}
            placeholder=""
            value={keyword}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {filteredItems.length > 0 && (
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={[styles.suggestionsContainer, { backgroundColor: isDarkMode ? '#2A2A2A' : '#FFFFFF' }]}>
                <FlatList
                  data={filteredItems}
                  keyExtractor={item => item.id}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSelect(item.name)}
                      testID={`suggestion-${item.id}`}>
                      <Text style={[styles.suggestionText, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={[styles.separator, { backgroundColor: isDarkMode ? '#444444' : greyColor }]} />
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          )}

          <ActiveKeywordFilters />
        </View>
      </TouchableWithoutFeedback>
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
    flexDirection: 'row',
  },
  suggestionsContainer: {
    borderRadius: 8,
    maxHeight: 200,
    marginTop: -10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  suggestionText: {
    fontSize: 14,
  },
  separator: {
    height: 1,
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
