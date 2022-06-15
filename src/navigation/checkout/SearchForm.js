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
    name: 'kebab',
    color: 'blue',
    image: 'https://i.imgur.com/PG8SO0n.jpeg',
  },
  {
    name: 'pizza',
    color: 'red',
    image: 'https://i.imgur.com/3ZmBgUW.jpeg',
  },
  {
    name: 'bowl poke',
    color: 'green',
    image: 'https://assets.tmecosys.com/image/upload/t_web600x528/img/recipe/ras/Assets/48842980-4850-4AC2-83E2-0FDFF673E798/Derivates/5ADA0F51-0681-4C5A-BDDB-D7E0EC740B1B.jpg',
  },
  {
    name: 'burger',
    color: 'brown',
    image: 'https://assets.afcdn.com/recipe/20161216/61596_w1200h800c1cx2808cy1872.jpg',
  },
  {
    name: 'kebab',
    color: 'blue',
    image: 'https://i.imgur.com/PG8SO0n.jpeg',
  },
  {
    name: 'pizza',
    color: 'red',
    image: 'https://i.imgur.com/3ZmBgUW.jpeg',
  },
  {
    name: 'bowl poke',
    color: 'green',
    image: 'https://assets.tmecosys.com/image/upload/t_web600x528/img/recipe/ras/Assets/48842980-4850-4AC2-83E2-0FDFF673E798/Derivates/5ADA0F51-0681-4C5A-BDDB-D7E0EC740B1B.jpg',
  },
  {
    name: 'burger',
    color: 'brown',
    image: 'https://assets.afcdn.com/recipe/20161216/61596_w1200h800c1cx2808cy1872.jpg',
  },
  {
    name: 'kebab',
    color: 'blue',
    image: 'https://i.imgur.com/PG8SO0n.jpeg',
  },
  {
    name: 'pizza',
    color: 'red',
    image: 'https://i.imgur.com/3ZmBgUW.jpeg',
  },
  {
    name: 'bowl poke',
    color: 'green',
    image: 'https://assets.tmecosys.com/image/upload/t_web600x528/img/recipe/ras/Assets/48842980-4850-4AC2-83E2-0FDFF673E798/Derivates/5ADA0F51-0681-4C5A-BDDB-D7E0EC740B1B.jpg',
  },
  {
    name: 'burger',
    color: 'brown',
    image: 'https://assets.afcdn.com/recipe/20161216/61596_w1200h800c1cx2808cy1872.jpg',
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
      {!this.state.autocomplete && <Facets onPress={() => {
        this.props.navigation.navigate('SearchResults')
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
