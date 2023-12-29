import { darkGreyColor, lightGreyColor, primaryColor, whiteColor } from '../../styles/common';
import { Box, Heading, Text, useColorModeValue } from 'native-base'
import AddressAutocomplete from '../../components/AddressAutocomplete';
import React, { useState } from 'react'
import { searchRestaurantsForAddress } from '../../redux/Checkout/actions';
import { newAddress } from '../../redux/Account/actions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import KeyboardAdjustView from '../../components/KeyboardAdjustView'

const textInputContainerHeight = 54
const autocompleteListMarginBottom = 8

const AskAddress = (props) => {
  const backgroundColor = useColorModeValue(whiteColor, darkGreyColor)

  const [ autocompleteListHeight, setAutocompleteListHeight ] = useState(0)

  const onLayout = event => {
    const currentFrame = event.nativeEvent.layout
    const listHeight = currentFrame.height - textInputContainerHeight - autocompleteListMarginBottom
    
    if (listHeight !== autocompleteListHeight) {
      setAutocompleteListHeight(listHeight)
    }
  }

  return <KeyboardAdjustView style={{ backgroundColor: primaryColor, flex: 1, padding: 20 }}>
    <Box style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
      <Heading color={whiteColor}>{ props.t('WHERE_ARE_YOU') }</Heading>
      <Text color={lightGreyColor}>{ props.t('ASK_ADDRESS_DISCLAIMER') }</Text>
    </Box>
    <Box style={{ flex:2 }} onLayout={onLayout}>
      <AddressAutocomplete
        inputContainerStyle={{
          justifyContent: 'center',
          borderWidth: 0,
          height: textInputContainerHeight,
        }}
        style={{
          height: (textInputContainerHeight * 0.7),
          borderRadius: 3,
          borderWidth: 0,
          backgroundColor: backgroundColor,
        }}
        flatListProps={{
          maxHeight: autocompleteListHeight
        }}
        onSelectAddress={ (address) => {
          props.newAddress(address)
          props.searchRestaurantsForAddress(address)
        }}
      />
    </Box>
  </KeyboardAdjustView>
}


function mapStateToProps(state) {

  return {
    address: state.checkout.address,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    searchRestaurantsForAddress: address => dispatch(searchRestaurantsForAddress(address)),
    newAddress: address => dispatch(newAddress(address)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(AskAddress))
