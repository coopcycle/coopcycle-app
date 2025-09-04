import { t } from 'i18next';
import _ from 'lodash';
import { FormControl } from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { CloseIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { SectionList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import i18n from '../../i18n';
import {
  clearSearchResults,
  loadAndNavigateToRestaurante,
  search,
} from '../../redux/Checkout/actions';
import { selectAvailableRestaurants } from '../../redux/Checkout/selectors';
import SearchItemSmallCard from './components/SearchItemSmallCard';

const TITLES = {
  shop: 'SEARCH_SHOPS',
  product: 'SEARCH_PRODUCTS',
};

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();

    this._onSearchItemPressed = this._onSearchItemPressed.bind(this);
  }

  _onChange = (q = null) => {
    if (q !== null && q.length > 2) {
      return this.props.search(q);
    }
    return;
  };

  _clearList = () => {
    this.props.clearSearchResults();
  };

  _shopId(item) {
    return parseInt(item.result_type === 'product' ? item.shop_id : item.id);
  }

  _parseResultsToSectionListData(results) {
    return results.reduce((groupedList, item) => {
      if (!_.includes(this.props.availableRestaurants, this._shopId(item))) {
        return groupedList;
      }
      const existingGroup = groupedList.find(
        dataItem => dataItem.type === item.result_type,
      );
      if (!existingGroup) {
        groupedList.push({
          type: item.result_type,
          data: [item],
        });
      } else {
        existingGroup.data.push(item);
      }
      return groupedList;
    }, []);
  }

  _onSearchItemPressed(item) {
    return this.props.loadAndNavigateToRestaurante(this._shopId(item));
  }

  render() {
    const { isLoading, searchResults, searchResultsLoaded } = this.props;

    return (
      <>
        <FormControl>
          <Input size="lg" className="m-4 p-2">
            <InputField
              blurOnSubmit={true}
              autoCorrect={false}
              ref={input => {
                this.textInput = input;
              }}
              type="web-search"
              onChangeText={_.debounce(this._onChange, 350)}
              placeholder={i18n.t('SEARCH_INPUT_PLACEHOLDER')} />
            <InputSlot className="pr-3" onPress={() => {
                this._clearList();
                this.textInput.clear();
                this.textInput.blur();
              }}>
              <InputIcon as={ CloseIcon } />
            </InputSlot>
          </Input>
        </FormControl>
        {!isLoading && searchResultsLoaded && searchResults ? (
          <SectionList
            marginLeft={4}
            sections={this._parseResultsToSectionListData(searchResults)}
            initialNumToRender={15}
            ListEmptyComponent={
              <Text textAlign={'center'} mx={4}>
                {t('SEARCH_WITHOUT_RESULTS')}
              </Text>
            }
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <SearchItemSmallCard
                item={item}
                onPress={pressedItem => this._onSearchItemPressed(pressedItem)}
              />
            )}
            renderSectionHeader={({ section: { type } }) => (
              <Text ml={2} bold>
                {t(TITLES[type])}
              </Text>
            )}
          />
        ) : null}
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoading: state.checkout.isLoading,
    searchResults: state.checkout.searchResults,
    searchResultsLoaded: state.checkout.searchResultsLoaded,
    availableRestaurants: selectAvailableRestaurants(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    search: q => dispatch(search(q)),
    loadAndNavigateToRestaurante: id =>
      dispatch(loadAndNavigateToRestaurante(id)),
    clearSearchResults: () => dispatch(clearSearchResults()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(SearchForm));
