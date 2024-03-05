import React, { useState } from 'react'
import { Linking, FlatList } from 'react-native'
import { Box, Text, Button, VStack, Pressable, HStack, Heading, Switch, Input } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import InputSpinner from 'react-native-input-spinner'

import { selectCart } from '../../redux/Checkout/selectors'
import { updateLoopeatReturns } from '../../redux/Checkout/actions'
import { formatPrice } from '../../utils/formatting'

function getNameFromId(formatId, formats) {
  const format = formats.find(f => f.id === formatId)
  return format.title
}

function getPriceFromId(formatId, formats) {
  const format = _.find(formats, f => f.id === formatId)
  return format.cost_cents
}

const getReturnsTotalAmount = (returns, formats) => returns.reduce(
  (total, container) => total + (getPriceFromId(container.format_id, formats) * container.quantity),
  0
)

function Loopeat({ cart, updateLoopeatReturns }) {

	const navigation = useNavigation()
	const { t } = useTranslation()

	const {
		containers,
		containersCount,
		requiredAmount,
		creditsCountCents,
		formats,
		returns: initialReturns,
	} = cart.loopeatContext

	const [ returns, setReturns ] = useState(initialReturns)
	const returnsTotalAmount = getReturnsTotalAmount(returns, formats)

	const missingAmount = requiredAmount - (creditsCountCents + returnsTotalAmount)

	const reusablePackagingAction =
		_.find(cart.potentialAction, action => action['@type'] === 'EnableReusablePackagingAction')

	return (
		<SafeAreaView flex={ 1 } edges={[ 'bottom' ]}>
			<VStack flex={ 1 } justifyContent="space-between">
				{ containersCount > 0 && (
					<Box p="3" mb="3">
						<Heading size="sm" mb="4">{ t('CHECKOUT_LOOPEAT_RETURN_CONTAINERS') }</Heading>
						<FlatList
		          data={ containers }
		          keyExtractor={ (item, index) => `loopeat_return_#${item.format_id}` }
		          renderItem={ ({ item }) => {

                const returnsForItem = _.find(returns, r => r.format_id === item.format_id)
                const isSelected = !!returnsForItem
                const value = returnsForItem ? returnsForItem.quantity : item.quantity

		          	return (
			          	<HStack justifyContent="space-between" alignItems="center" mb="2">
			          		<HStack alignItems="center">
			          			<Switch
                        size="sm"
			          				isChecked={ isSelected }
			          				onToggle={ checked => {
				          				const newReturns = checked ?
				                    [ ...returns, item ] : _.filter(returns, r => r.format_id !== item.format_id)
				                  setReturns(newReturns)
				          			} } />
			          			<Text ml="2">{ `${getNameFromId(item.format_id, formats)} (${formatPrice(getPriceFromId(item.format_id, formats))})` }</Text>
			          		</HStack>
                      <InputSpinner
                        width={ 80 }
                        height={ 40 }
                        min={ 1 }
                        max={ item.quantity }
                        editable={ isSelected }
                        value={ value }
                        onChange={ (value) => {
                          const idx = _.findIndex(returns, r => r.format_id === item.format_id)
                          if (idx !== -1) {
                            const newReturns = returns.map(function(ret, retIndex) {
                              return retIndex === idx ? { ...ret, quantity: value } : ret;
                            });
                            setReturns(newReturns)
                          }
                        }}
                        skin="square"
                        shadow={ false }
                        buttonStyle={{
                          width: '33.3333%',
                        }} />
                    </HStack>
                )
		        	}} />
		        </Box>
				) }
				<Box p="3">
					<Heading size="sm" mb="4">{ t('CHECKOUT_LOOPEAT_WALLET_AMOUNT', { amount: formatPrice(creditsCountCents) }) }</Heading>
					<Button variant="outline"
						onPress={ () => Linking.openURL(reusablePackagingAction.loopeatOAuthUrl + '&required_credits_cents=' + requiredAmount + '&show_deposit=true') }>
            { t('CHECKOUT_LOOPEAT_ADD_CREDITS') }
          </Button>
				</Box>
				<Box p="3">
					<VStack mb="3">
						<HStack justifyContent="space-between">
							<Text>{ t('TOTAL') }</Text>
							<Text>{ formatPrice(requiredAmount) }</Text>
						</HStack>
						<HStack justifyContent="space-between">
							<Text>{ t('CHECKOUT_LOOPEAT_WALLET') }</Text>
							<Text>{ formatPrice(creditsCountCents) }</Text>
						</HStack>
						<HStack justifyContent="space-between">
							<Text>{ t('CHECKOUT_LOOPEAT_TOTAL_RETURNS') }</Text>
							<Text>{ formatPrice(returnsTotalAmount) }</Text>
						</HStack>
					</VStack>
					{ missingAmount > 0 && (
						<Text textAlign="center" mb="2" color="red.500">{ t('CHECKOUT_LOOPEAT_MISSING_AMOUNT', { amount: formatPrice(missingAmount) }) }</Text>
					) }
					<Button onPress={ () => {
						updateLoopeatReturns(returns)
						navigation.navigate('CheckoutSummary')
					}}>{ t('CHECKOUT_LOOPEAT_VALIDATE') }</Button>
				</Box>
			</VStack>
		</SafeAreaView>
  )
}

function mapStateToProps(state) {

  const { cart } = selectCart(state)

  return {
    cart,
  }
}

function mapDispatchToProps(dispatch) {

  return {
    updateLoopeatReturns: (returns) => dispatch(updateLoopeatReturns(returns)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loopeat)
