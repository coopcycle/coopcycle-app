import React, {Component} from 'react';
import {
  Box,
  ChevronRightIcon,
  FormControl,
  HStack,
  IconButton,
  Image,
  Input, ScrollView,
  Stack,
  Text,
  View,
  VStack,
} from 'native-base';
import {withTranslation} from 'react-i18next';
import i18n from '../../i18n';
import {applyRestaurantsFilters, clearRestaurantsFilters, setRestaurant} from '../../redux/Checkout/actions';
import {connect} from 'react-redux';
import {filterActive} from '../../redux/Checkout/selectors';
import FacetCard from './components/FacetCard';
import {Spacer} from 'native-base/src/components/primitives/Flex';
import SearchEngine from '../../utils/searchEngine';
import {FlatList, TouchableOpacity} from 'react-native';
import {darkGreyColor, greyColor} from '../../styles/common';
import _ from 'lodash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const DATA = [
  {
    name: 'Exclusivités',
    color: 'yellow',
    image: 'https://i.imgur.com/lQ1pvGr.png',
  },
  {
    name: 'Burgers',
    color: 'brown',
    image: 'https://i.imgur.com/guWCeLZ.png',
  },
  {
    name: 'Asiatique',
    color: 'blue',
    image: 'https://i.imgur.com/IPC9Q6Q.png',
  },
  {
    name: 'Pizza',
    color: 'red',
    image: 'https://i.imgur.com/ywBdBfw.png',
  },
]

const Facets = (props) => <FlatList data={DATA} columnWrapperStyle={{
  flexGrow: 1,
  flexDirection: 'row',
  justifyContent: 'center',
}} numColumns={2} renderItem={({item}) => <FacetCard name={item.name} onPress={props.onPress}
                                      image={item.image} />} />


const autocompleteItem = (restaurant, onPress) => {
  const AltText = () => {
    let text;
    if (restaurant.facets.cuisine.length > 0) {
      text = restaurant.facets.cuisine.join(' ∙ ');
    } else {
      text = restaurant.address.streetAddress;
    }

    return <Text color={darkGreyColor}>{text}</Text>

  }
  return (
    <><TouchableOpacity onPress={() => onPress(restaurant) }>
      <HStack space={4} padding={3}>
        <Image size="xs" source={{uri: restaurant.image}} alt={restaurant.name} />
        <VStack>
          <Text bold>{restaurant.name}</Text>
          <AltText/>
        </VStack>
        <Spacer/>
        <View style={{flexGrow: 1, justifyContent:'center', alignItems: 'flex-end'}}>
          <ChevronRightIcon />
        </View>
      </HStack>
    </TouchableOpacity>
      <Box marginLeft={5} marginRight={5} borderBottomWidth={1} borderColor={greyColor} />
    </>
  )
}

const Autocomplete = (props) => {

  return <FlatList
    data={props.restaurants}
    initialNumToRender={ 15 }
    renderItem={({item}) => autocompleteItem(item.item, props.onPress)}
   />
}

class SearchForm extends Component {

    constructor(props) {
      super(props);
      this.textInput = React.createRef()
      this.state = {
        autocomplete: null,
        loading: false,
        query: null,
      };
    }

    _setFilter = () => {
      this.setState({loading: true})
      this.props.applyRestaurantsFilters({
        query: this.state.query,
      })
      this.props.navigation.goBack()
      this.setState({loading: false})
    }

    _clearFilter = () => {
      this.props.clearRestaurantsFilters()
      this.props.navigation.goBack()
    }
/*

 <HStack alignItems="center" space={4}>
          <Switch size="md" />
          <Text>Végan</Text>
        </HStack>
        <HStack alignItems="center" space={4}>
          <Switch size="md" />
          <Text>Sans arachides</Text>
        </HStack>

                <VStack><Button onPress={this._clearFilter} isDisabled={!this.props.filterActive} colorScheme="success">{i18n.t('RESET')}</Button></VStack>

 */

  _onChange = (q = null) => {
    if (q === null || q.length === 0) {
      this.setState({autocomplete: null})
      return;
    }
    this.setState({autocomplete: SearchEngine.search(q)})
  }

  render() {
    return <Box><FormControl>
      <Stack space={5}>
          <Input size="xl" margin={5} p={2}
                 ref={input => { this.textInput = input }}
                 keyboardType="web-search"
                 blurOnSubmit={true}
                 autoCorrect={false}
                 InputRightElement={<IconButton _icon={{as: FontAwesome5, name: 'times'}} onPress={() => {this._onChange(); this.textInput.clear(); this.textInput.blur()}} />}
                 onChangeText={_.debounce(this._onChange, 350)} onSubmitEditing={({ nativeEvent: { text }}) => {
                    console.log(text)
                    console.log(SearchEngine.search(text))
          }} placeholder={i18n.t('SEARCH')} />
       </Stack>
    </FormControl>
      {!this.state.autocomplete && <Facets onPress={(query) => {
        this.props.navigation.navigate('SearchResults', {query})
      }} />}
      {this.state.autocomplete && <Autocomplete restaurants={this.state.autocomplete} onPress={(restaurant) => {
        this.props.setRestaurant(restaurant['@id'])
        this.props.navigation.navigate('CheckoutRestaurant', { restaurant })
      }} />}
    </Box>

  }
}


function mapStateToProps(state) {

  return {
    restaurantsFilter: state.checkout.restaurantsFilter,
    filterActive: filterActive(state),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    applyRestaurantsFilters: (filter) => dispatch(applyRestaurantsFilters(filter)),
    setRestaurant: id => dispatch(setRestaurant(id)),
    clearRestaurantsFilters: () => dispatch(clearRestaurantsFilters()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SearchForm))
