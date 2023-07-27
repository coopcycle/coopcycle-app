import React, { useState } from 'react'
import { Linking, FlatList } from 'react-native'
import { Box, Text, Button, VStack, Pressable, HStack, Heading } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'

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
					<Box p="3" mb="3" bg="light.200">
						<Heading size="sm">{ t('CHECKOUT_LOOPEAT_RETURN_CONTAINERS') }</Heading>
						<FlatList
		          data={ containers }
		          keyExtractor={ (item, index) => `loopeat_return_#${item.format_id}` }
		          renderItem={ ({ item }) => (
		          	<HStack justifyContent="space-between" alignItems="center" mb="2">
		          		<Text>{ `${item.quantity} × ${getNameFromId(item.format_id, formats)} (${formatPrice(getPriceFromId(item.format_id, formats))})` }</Text>
		          		<Button variant="outline" size="sm" onPress={ () => {
		          			const newReturns = _.find(returns, r => r.format_id === item.format_id) ?
	                    _.filter(returns, r => r.format_id !== item.format_id) : [ ...returns, item ]

	                  setReturns(newReturns)
		          		} }>{ _.find(returns, r => r.format_id === item.format_id) ? t('CANCEL') : t('CHECKOUT_LOOPEAT_RETURN_CONTAINER') }</Button>
		          	</HStack>
		          ) } />
		        </Box>
				) }
				{ missingAmount > 0 &&
				<Box p="3">
					<Button variant="outline"
						onPress={ () => Linking.openURL(reusablePackagingAction.loopeatOAuthUrl + '&required_credits_cents=' + requiredAmount) }>
            { t('CHECKOUT_LOOPEAT_ADD_CREDITS') }
          </Button>
				</Box>
				}
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
						<HStack justifyContent="space-between">
							<Text>{ t('CHECKOUT_LOOPEAT_DIFF') }</Text>
							<Text>{ formatPrice(missingAmount * -1) }</Text>
						</HStack>
					</VStack>
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
