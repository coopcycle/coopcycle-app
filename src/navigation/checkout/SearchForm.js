import React, { Component } from 'react';
import { FormControl, IconButton, Input, Text } from 'native-base';
import { withTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { clearSearchResults, loadAndNavigateToRestaurante, search } from '../../redux/Checkout/actions';
import { connect } from 'react-redux';
import { SectionList } from 'react-native';
import _ from 'lodash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { t } from 'i18next';
import SearchItemSmallCard from './components/SearchItemSmallCard';

const TITLES = {
  'shop': 'SEARCH_SHOPS',
  'product': 'SEARCH_PRODUCTS',
}

class SearchForm extends Component {

  constructor(props) {
    super(props);
    this.textInput = React.createRef()

    this._onSearchItemPressed = this._onSearchItemPressed.bind(this)
  }

  _onChange = (q = null) => {
    if (q !== null || q > 2) {
      return this.props.search(q)
    }
    return;
  }

  _clearList = () => {
    this.props.clearSearchResults()
  }

  _parseResultsToSectionListData(results) {
    return results.reduce((groupedList, item) => {
      const existingGroup = groupedList.find((dataItem) => dataItem.type === item.result_type)
      if (!existingGroup) {
        groupedList.push({
          type: item.result_type,
          data: [item],
        })
      } else {
        existingGroup.data.push(item)
      }
      return groupedList
    }, [])
  }

  _onSearchItemPressed(item) {
    const shopId = item.result_type === 'product' ? item.shop_id : item.id
    return this.props.loadAndNavigateToRestaurante(shopId)
  }

  render() {

    const { isLoading, searchResults, searchResultsLoaded } = this.props

    return (
      <>
        <FormControl>
          <Input size="md" m={4} p={2}
            ref={input => { this.textInput = input }}
            keyboardType="web-search"
            blurOnSubmit={true}
            autoCorrect={false}
            InputRightElement={<IconButton _icon={{ as: FontAwesome5, name: 'times' }} onPress={() => {this._clearList(); this.textInput.clear(); this.textInput.blur()}} />}
            onChangeText={_.debounce(this._onChange, 350)}
            placeholder={i18n.t('SEARCH')} />
        </FormControl>
        {
          !isLoading && searchResultsLoaded && searchResults  ?
          <SectionList
            marginLeft={4}
            sections={this._parseResultsToSectionListData(searchResults)}
            initialNumToRender={15}
            ListEmptyComponent={ <Text textAlign={'center'} mx={4}>{ t('SEARCH_WITHOUT_RESULTS') }</Text> }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SearchItemSmallCard item={item} onPress={ (pressedItem) => this._onSearchItemPressed(pressedItem)} />}
            renderSectionHeader={({ section: { type } }) => (
              <Text ml={2} bold>{ t(TITLES[type]) }</Text>
            )}
          />
          : null
        }
      </>
    )
  }
}


function mapStateToProps(state) {

  return {
    isLoading: state.checkout.isLoading,
    searchResults: state.checkout.searchResults,
    searchResultsLoaded: state.checkout.searchResultsLoaded,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    search: q => dispatch(search(q)),
    loadAndNavigateToRestaurante: (id) => dispatch(loadAndNavigateToRestaurante(id)),
    clearSearchResults: () => dispatch(clearSearchResults()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SearchForm))
