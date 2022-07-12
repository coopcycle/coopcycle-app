import { SectionList, View } from 'react-native';
import GroupImageHeader from './GroupImageHeader';
import React from 'react';
import { Heading } from 'native-base';
import SearchEngine from '../../../utils/searchEngine';
import _ from 'lodash';
import i18n from '../../../i18n';
import { setRestaurant } from '../../../redux/Checkout/actions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import RestaurantSmallCard from './RestaurantSmallCard';


//FEAT: No results
const SearchForm = (props) => {

  const { query: { name, image } } = props.route.params

  const topResults = SearchEngine.search(`=${name}`)
  const topIndex = _.map(topResults, 'refIndex')
  const altResults = SearchEngine.search(name)
    .filter(value => !topIndex.includes(value.refIndex))

  const DATA = _.filter([
    { title: i18n.t('TOP_RESULTS'), data: topResults }, { title: i18n.t('OTHER_RESULTS'), data: altResults },
  ], value => value.data.length > 0)

  const showHeaders = DATA.length > 1

  return <View style={{ flex: 1 }}>
    <View style={{ flex: 1, paddingTop: 60 }}>
      <View style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 60 }}>
        <GroupImageHeader image={image} text={name} />
      </View>
      <View padding={5}>
        <Heading paddingLeft={5}>{i18n.t('RESULT', { count: altResults.length + topResults.length })}</Heading>
        <SectionList
          sections={DATA}
          initialNumToRender={ 15 }
          keyExtractor={(item, index) => item + index}
          renderItem={({ item: { item } }) => <RestaurantSmallCard restaurant={item} onPress={() => {
            props.setRestaurant(item['@id'])
            props.navigation.navigate('CheckoutRestaurant', { restaurant: item })
          }} shippingTime={true} />}
          renderSectionHeader={({ section: { title } }) => {
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
