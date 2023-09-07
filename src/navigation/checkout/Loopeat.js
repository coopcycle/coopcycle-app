import React, { useState } from 'react'
import { Linking, FlatList } from 'react-native'
import { Box, Text, Button, VStack, Pressable, HStack, Heading, Switch, Input } from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import NumericInput from 'react-native-numeric-input'

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
						<Heading size="sm" mb="4">{ t('CHECKOUT_LOOPEAT_RETURN_CONTAINERS') }</Heading>
						<FlatList
		          data={ containers }
		          keyExtractor={ (item, index) => `loopeat_return_#${item.format_id}` }
		          renderItem={ ({ item }) => {

		          	const isSelected = !!_.find(returns, r => r.format_id === item.format_id)

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
                      <NumericInput
                        totalWidth={ 70 }
                        minValue={ 1 }
                        maxValue={ item.quantity }
                        editable={ isSelected }
                        onChange={ value => {
                          const idx = _.findIndex(returns, r => r.format_id === item.format_id)
                          if (idx !== -1) {
                            const newReturns = returns.map(function(ret, retIndex) {
                              return retIndex === idx ? { ...ret, quantity: value } : ret;
                            });
                            setReturns(newReturns)
                          }
                        }} />
                    </HStack>
                )
		        	}} />
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
