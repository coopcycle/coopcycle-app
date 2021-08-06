import React, { Component } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { HeaderBackButton } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'

const HeaderBackButtonWrapper = (props) => {

  const { t } = useTranslation()
  const navigation = useNavigation()

  let { onPress, title, backImage, currentRoute, ...otherProps } = props

  if (currentRoute === 'StoreNewDeliveryAddress') {
    title = t('CANCEL')
  } else {
    title = 'Back'
  }

  return (
    <HeaderBackButton { ...otherProps }
      onPress={ () => navigation.goBack(null) }
      title={ title }
      backImage={ backImage } />
  )
}

function mapStateToProps (state) {

  return {
    currentRoute: state.app.currentRoute,
  }
}

export default connect(mapStateToProps)(HeaderBackButtonWrapper)
