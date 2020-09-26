import React, { Component } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import screens from '..'
import { selectSignatureScreenFirst } from '../../redux/Courier'

function mapStateToProps(state) {

  return {
    signatureScreenFirst: selectSignatureScreenFirst(state),
  }
}


const Tab = createMaterialTopTabNavigator()

const TabNav = withTranslation()(({ t, signatureScreenFirst }) => {

  return (
    <Tab.Navigator
      // Disable swipe to avoid swiping when signing
      swipeEnabled={ false }
      backBehavior="history"
      initialRouteName={ signatureScreenFirst ? 'TaskSignature' : 'TaskPhoto' }>
      <Tab.Screen
        name="TaskPhoto"
        component={ screens.TaskPhoto }
        options={{
          title: t('PHOTO'),
        }} />
      <Tab.Screen
        name="TaskSignature"
        component={ screens.TaskSignature }
        options={{
          title: t('SIGNATURE'),
        }} />
    </Tab.Navigator>
  )
})

export default connect(mapStateToProps)(TabNav)
