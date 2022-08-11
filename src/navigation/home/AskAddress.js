import { darkGreyColor, lightGreyColor, primaryColor, whiteColor } from '../../styles/common';
import { Box, Button, Heading, Text } from 'native-base';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import { Appearance, View } from 'react-native';
import React from 'react';
import { searchRestaurantsForAddress } from '../../redux/Checkout/actions';
import { newAddress } from '../../redux/Account/actions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import MapView, { Geojson } from 'react-native-maps';
import { TouchableOpacity } from 'react-native-gesture-handler';
import i18n from '../../i18n';

const textInputContainerHeight = 62

const myPlace = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: { 'type':'Polygon','coordinates':[[[ -1.52890205383298,47.2357790423796 ],[ -1.53254985809323,47.2370611335653 ],[ -1.53177738189694,47.2381246629407 ],[ -1.5378928184509,47.2402516576513 ],[ -1.53963088989255,47.2382120753646 ],[ -1.54368638992307,47.239450402545 ],[ -1.54602527618402,47.2369882883064 ],[ -1.54838562011716,47.2359684441667 ],[ -1.55177593231198,47.2354148062709 ],[ -1.55542373657224,47.234030686225 ],[ -1.55662536621091,47.2350505676587 ],[ -1.5588569641113,47.2342783735206 ],[ -1.56124949455255,47.2357061953582 ],[ -1.5630412101745,47.2361760568863 ],[ -1.56476855278009,47.2363144649142 ],[ -1.56532645225518,47.2361432759846 ],[ -1.56657099723809,47.2356187788002 ],[ -1.56899571418756,47.23525454159 ],[ -1.57221436500543,47.2337975677127 ],[ -1.57607674598687,47.2322239909319 ],[ -1.5773427486419,47.2303261660394 ],[ -1.57795429229733,47.2290184122182 ],[ -1.5817308425903,47.2281441298289 ],[ -1.58349037170407,47.2269783975435 ],[ -1.58462762832639,47.2250257385291 ],[ -1.58548593521115,47.2235393379298 ],[ -1.58653736114499,47.2215865522321 ],[ -1.58739566802975,47.2200271866288 ],[ -1.58812522888179,47.2183220334282 ],[ -1.58812522888181,47.2174475746177 ],[ -1.58788919448848,47.2165876760576 ],[ -1.58709526062007,47.2152176393751 ],[ -1.58650517463676,47.214510744903 ],[ -1.58651590347285,47.2138038410078 ],[ -1.58696651458736,47.2128564292575 ],[ -1.58718109130855,47.2118944246238 ],[ -1.58782482147212,47.2113551113622 ],[ -1.58756732940669,47.2102618919796 ],[ -1.58818960189815,47.2077401133319 ],[ -1.58900499343867,47.2049995474134 ],[ -1.59016370773311,47.2031043924292 ],[ -1.59003496170039,47.2009175910104 ],[ -1.58977746963496,47.1991972438822 ],[ -1.5883612632751,47.1970102814149 ],[ -1.58299684524532,47.1970686015839 ],[ -1.57776117324825,47.1983807884387 ],[ -1.5727829933166,47.197943396426 ],[ -1.56338453292842,47.1975060008077 ],[ -1.56432867050166,47.1937442496514 ],[ -1.56368494033809,47.1918778555338 ],[ -1.56098127365108,47.1916153885968 ],[ -1.55784845352168,47.1914695730709 ],[ -1.55514478683467,47.1917320407291 ],[ -1.55424356460567,47.1909446338606 ],[ -1.55287027359004,47.1898655758448 ],[ -1.55256986618037,47.1885823431611 ],[ -1.55003786087032,47.1879115500926 ],[ -1.54797792434688,47.1876782287773 ],[ -1.54630422592159,47.1881157054021 ],[ -1.54729127883907,47.1917320407291 ],[ -1.54647588729854,47.1927527359492 ],[ -1.53936266899101,47.1930589406873 ],[ -1.53819322586055,47.1936786353464 ],[ -1.53671264648433,47.194582647518 ],[ -1.53574705123897,47.1948159384818 ],[ -1.53466343879695,47.1959459270723 ],[ -1.53362274169914,47.1967842901548 ],[ -1.53228163719169,47.1972654316808 ],[ -1.53097271919242,47.1973747814191 ],[ -1.52953505516044,47.1980673245289 ],[ -1.52822613716117,47.1990077107024 ],[ -1.52631640434257,47.2001084516398 ],[ -1.52471780776973,47.2010852489763 ],[ -1.5249109268188,47.202608725341 ],[ -1.52420282363887,47.2032428868172 ],[ -1.52412772178642,47.2042196264448 ],[ -1.52322649955739,47.2067342837769 ],[ -1.52197122573848,47.2102764683863 ],[ -1.52213215827933,47.2138038410077 ],[ -1.5189671516418,47.2159901112187 ],[ -1.52158498764034,47.2192256257151 ],[ -1.52244329452512,47.2222714927191 ],[ -1.52119874954221,47.2232333091033 ],[ -1.52016878128049,47.2243554061635 ],[ -1.52190685272214,47.2256377737208 ],[ -1.52282953262326,47.2276049818336 ],[ -1.52310848236081,47.2284647017127 ],[ -1.5237736701965,47.2292224093673 ],[ -1.52845144271848,47.2325445381398 ],[ -1.52890205383298,47.2357790423796 ]]] },
    },
  ],
};

const Map = props => (
  <MapView
    style={{
      height: '100%',
      width: '100%',
    }}
    initialRegion={{
      latitude: 47.218371,
      longitude: 	-1.553621,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }}
  >
    <Geojson
      geojson={myPlace}
      strokeColor={primaryColor}
      fillColor={primaryColor + '2a'}
      strokeWidth={2}
    />
  </MapView>
);

const AskAddress = (props) => {

  const colorScheme = Appearance.getColorScheme()
  const bgColor = colorScheme === 'dark' ? darkGreyColor : whiteColor
  if (props.help)
    {return <Map />}

  return <View style={{ backgroundColor: primaryColor, flex: 1, padding: 20 }}>
    <Box style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
      <Heading color={whiteColor}>{ props.t('WHERE_ARE_YOU') }</Heading>
      <Text color={lightGreyColor}>{ props.t('ASK_ADDRESS_DISCLAIMER') }</Text>
    </Box>
    <Box style={{ flex:3 }}>
      <AddressAutocomplete
        inputContainerStyle={{
          borderWidth: 0,
          height: textInputContainerHeight,
        }}
        style={{
          height: (textInputContainerHeight * 0.7),
          borderRadius: 3,
          borderWidth: 0,
          backgroundColor: bgColor,
          zIndex: 2,
        }}
        country={ props.country }
        location={ props.location }
        onSelectAddress={ (address) => {
          props.newAddress(address)
          props.searchRestaurantsForAddress(address)
        }}
        renderBottom={() => <TouchableOpacity onPress={() => props.navigation.setParams({ help: true })}>
          <Button bgColor={bgColor + '88'} size={'sm'} zIndex={1} paddingBottom={5} Radius={0}>{i18n.t('SHOW_DELIVERY_ZONE')}</Button>
        </TouchableOpacity>}
      />
    </Box>
  </View>
}


function mapStateToProps(state, ownProps) {

  return {
    location: state.app.settings.latlng,
    country: state.app.settings.country,
    address: state.checkout.address,
    help: ownProps.route.params?.help || false,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    searchRestaurantsForAddress: address => dispatch(searchRestaurantsForAddress(address)),
    newAddress: address => dispatch(newAddress(address)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AskAddress))
