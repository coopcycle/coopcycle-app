import { Box, Heading, Text } from 'native-base';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import AddressAutocomplete from '../../components/AddressAutocomplete';
import KeyboardAdjustView from '../../components/KeyboardAdjustView';
import { newAddress } from '../../redux/Account/actions';
import { searchRestaurantsForAddress } from '../../redux/Checkout/actions';
import {
  useBackgroundColor,
  useBaseTextColor,
  useSecondaryTextColor,
} from '../../styles/theme';

const textInputContainerHeight = 54;
const autocompleteListMarginBottom = 8;

const AskAddress = props => {
  const [autocompleteListHeight, setAutocompleteListHeight] = useState(0);
  const backgroundColor = useBackgroundColor();
  const textColor = useBaseTextColor();
  const secondaryTextColor = useSecondaryTextColor();

  const onLayout = event => {
    const currentFrame = event.nativeEvent.layout;
    const listHeight =
      currentFrame.height -
      textInputContainerHeight -
      autocompleteListMarginBottom;

    if (listHeight !== autocompleteListHeight) {
      setAutocompleteListHeight(listHeight);
    }
  };

  return (
    <KeyboardAdjustView
      testID="checkoutAskAddress"
      style={{ backgroundColor, flex: 1, padding: 20 }}>
      <Box style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
        <Heading color={textColor}>{props.t('WHERE_ARE_YOU')}</Heading>
        <Text color={secondaryTextColor}>
          {props.t('ASK_ADDRESS_DISCLAIMER')}
        </Text>
      </Box>
      <Box style={{ flex: 2 }} onLayout={onLayout}>
        <AddressAutocomplete
          testID="askAddressAutocomplete"
          inputContainerStyle={{
            height: textInputContainerHeight,
          }}
          style={{
            height: textInputContainerHeight * 0.7,
          }}
          flatListProps={{
            maxHeight: autocompleteListHeight,
          }}
          onSelectAddress={address => {
            props.newAddress(address);
            props.searchRestaurantsForAddress(address);
          }}
        />
      </Box>
    </KeyboardAdjustView>
  );
};

function mapStateToProps(state) {
  return {
    address: state.checkout.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    searchRestaurantsForAddress: address =>
      dispatch(searchRestaurantsForAddress(address)),
    newAddress: address => dispatch(newAddress(address)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(AskAddress));
