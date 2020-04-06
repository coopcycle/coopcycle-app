import React, { Component } from 'react'
import { Alert, View } from 'react-native'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import HeaderButton from '../../../components/HeaderButton'
import { closeRestaurant } from '../../../redux/Restaurant/actions'
import { selectSpecialOpeningHoursSpecification } from '../../../redux/Restaurant/selectors'

class HeaderRight extends Component {

  onPressClose() {
    Alert.alert(
      this.props.t('RESTAURANT_CLOSE_ALERT_TITLE'),
      this.props.t('RESTAURANT_CLOSE_ALERT_MESSAGE'),
      [
        {
          text: this.props.t('RESTAURANT_CLOSE_ALERT_CONFIRM'),
          onPress: () => this.props.closeRestaurant(this.props.restaurant)
        },
        {
          text: this.props.t('CANCEL'),
          style: 'cancel'
        },
      ]
    )
  }

  render() {

    const { navigate } = this.props.navigation
    const { specialOpeningHoursSpecification } = this.props

    return (
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        { !specialOpeningHoursSpecification && (
          <HeaderButton iconType="FontAwesome" iconName="power-off"
            onPress={ () => this.onPressClose() } />
        )}
        <HeaderButton iconName="settings"
          onPress={ () => navigate('RestaurantSettings') } />
      </View>
    )
  }
}

function mapStateToProps(state) {

  return {
    restaurant: state.restaurant.restaurant,
    specialOpeningHoursSpecification: selectSpecialOpeningHoursSpecification(state),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    closeRestaurant: restaurant => dispatch(closeRestaurant(restaurant)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HeaderRight))
