import React, { Component } from 'react';
import { Box, FormControl, IconButton, Input, Stack } from 'native-base';
import { withTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { setRestaurant } from '../../redux/Checkout/actions';
import { connect } from 'react-redux';
import FacetCard from './components/FacetCard';
import SearchEngine from '../../utils/searchEngine';
import { FlatList } from 'react-native';
import _ from 'lodash';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RestaurantSmallCard from './components/RestaurantSmallCard';


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
}} numColumns={2} renderItem={({ item }) => <FacetCard name={item.name} onPress={props.onPress}
                                      image={item.image} />} />

const Autocomplete = (props) => {

  return <FlatList
    data={props.restaurants}
    initialNumToRender={ 15 }
    renderItem={({ item }) => <RestaurantSmallCard restaurant={item.item} onPress={props.onPress} />}
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

  _onChange = (q = null) => {
    if (q === null || q.length === 0) {
      this.setState({ autocomplete: null })
      return;
    }
    this.setState({ autocomplete: SearchEngine.search(q) })
  }

  render() {
    return <Box><FormControl>
      <Stack space={5}>
          <Input size="xl" margin={5} p={2}
                 ref={input => { this.textInput = input }}
                 keyboardType="web-search"
                 blurOnSubmit={true}
                 autoCorrect={false}
                 InputRightElement={<IconButton _icon={{ as: FontAwesome5, name: 'times' }} onPress={() => {this._onChange(); this.textInput.clear(); this.textInput.blur()}} />}
                 onChangeText={_.debounce(this._onChange, 350)} onSubmitEditing={({ nativeEvent: { text } }) => {
                    console.log(text)
                    console.log(SearchEngine.search(text))
          }} placeholder={i18n.t('SEARCH')} />
       </Stack>
    </FormControl>
      {!this.state.autocomplete && <Facets onPress={(query) => {
        this.props.navigation.navigate('SearchResults', { query })
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
  }
}

function mapDispatchToProps(dispatch) {

  return {
    setRestaurant: id => dispatch(setRestaurant(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SearchForm))
