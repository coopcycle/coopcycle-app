import {SectionList, TouchableOpacity, View} from 'react-native';
import GroupImageHeader from './GroupImageHeader';
import React from 'react';
import {Avatar, Box, ChevronRightIcon, Heading, HStack, Icon, Image, Text, VStack} from 'native-base';
import SearchEngine from '../../../utils/searchEngine';
import {darkGreyColor, greyColor} from '../../../styles/common';
import _ from 'lodash';
import {Spacer} from 'native-base/src/components/primitives/Flex';
import i18n from '../../../i18n';
import moment from 'moment';
import {getNextShippingTimeAsText} from '../../../utils/checkout';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {filterActive} from '../../../redux/Checkout/selectors';
import {applyRestaurantsFilters, clearRestaurantsFilters, setRestaurant} from '../../../redux/Checkout/actions';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';

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
      <HStack space={4} padding={2}>
        <Image size="sm" source={{uri: restaurant.image}} alt={restaurant.name} />
        <VStack>
          <Text bold>{restaurant.name}</Text>
          <AltText/>
          <Text>{getNextShippingTimeAsText(restaurant)}</Text>
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



//FEAT: No results
const SearchForm = (props) => {

  const { query: {name, image} } = props.route.params

  const topResults = SearchEngine.search(`=${name}`)
  const topIndex = _.map(topResults, 'refIndex')
  const altResults = SearchEngine.search(name)
    .filter(value => !topIndex.includes(value.refIndex))

  const DATA = _.filter([
    {title: i18n.t('TOP_RESULTS'), data: topResults,}, {title: i18n.t('OTHER_RESULTS'), data: altResults}
  ], value => value.data.length > 0)

  const showHeaders = DATA.length > 1

  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1, paddingTop: 60 }}>
      <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60 }}>
        <GroupImageHeader image={image} text={name} />
      </View>
      <View padding={5}>
        <Heading paddingLeft={5} color={darkGreyColor}>{i18n.t('RESULT', {count: altResults.length + topResults.length})}</Heading>
        <SectionList
          sections={DATA}
          initialNumToRender={ 15 }
          keyExtractor={(item, index) => item + index}
          renderItem={({item: {item}}) => {
            return autocompleteItem(item, () => {
              props.setRestaurant(item['@id'])
              props.navigation.navigate('CheckoutRestaurant', { restaurant: item })
            })
          } }
          renderSectionHeader={({ section: {title} }) => {
              return showHeaders ? <Heading size={'md'} padding={2}>{title}</Heading> : <></>
          }}
        />
      </View>
    </View>
  </View>
}


function mapStateToProps(state) {

  return { }
}

function mapDispatchToProps(dispatch) {

  return {
    setRestaurant: id => dispatch(setRestaurant(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(SearchForm))
