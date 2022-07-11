import React, { Component } from 'react'
import { Alert } from 'react-native'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { HeaderButton, HeaderButtons, Item } from 'react-navigation-header-buttons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { closeRestaurant } from '../../../redux/Restaurant/actions'
import { selectSpecialOpeningHoursSpecificationForToday } from '../../../redux/Restaurant/selectors'

const FontAwesomeHeaderButton = props => (
  <HeaderButton { ...props } IconComponent={ FontAwesome } iconSize={ 23 } color="#ffffff" />
)

class HeaderRight extends Component {

  onPressClose() {
    Alert.alert(
      this.props.t('RESTAURANT_CLOSE_ALERT_TITLE'),
      this.props.t('RESTAURANT_CLOSE_ALERT_MESSAGE'),
      [
        {
          text: this.props.t('RESTAURANT_CLOSE_ALERT_CONFIRM'),
          onPress: () => this.props.closeRestaurant(this.props.restaurant),
        },
        {
          text: this.props.t('CANCEL'),
          style: 'cancel',
        },
      ]
    )
  }

  render() {

    const { navigate } = this.props.navigation
    const { specialOpeningHoursSpecification } = this.props

    return (
      <HeaderButtons HeaderButtonComponent={ FontAwesomeHeaderButton }>
        { !specialOpeningHoursSpecification && (
          <Item title="close" iconName="power-off" onPress={ () => this.onPressClose() } />
        )}
        <Item title="openSettings" iconName="cog" onPress={ () => navigate('RestaurantSettings') } />
      </HeaderButtons>
    )
  }
}

function mapStateToProps(state) {

  return {
    restaurant: state.restaurant.restaurant,
    specialOpeningHoursSpecification: selectSpecialOpeningHoursSpecificationForToday(state),
  }
}

function mapDispatchToProps(dispatch) {

  return {
    closeRestaurant: restaurant => dispatch(closeRestaurant(restaurant)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(HeaderRight))
