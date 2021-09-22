import React from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { HeaderBackButton } from '@react-navigation/stack'

const HeaderBackButtonWrapper = (props) => {

  const { t } = useTranslation()

  let { title, currentRoute, ...otherProps } = props

  if (currentRoute === 'StoreNewDeliveryAddress') {
    title = t('CANCEL')
  } else {
    title = 'Back'
  }

  return (
    <HeaderBackButton { ...otherProps } title={ title } />
  )
}

function mapStateToProps (state) {

  return {
    currentRoute: state.app.currentRoute,
  }
}

export default connect(mapStateToProps)(HeaderBackButtonWrapper)
