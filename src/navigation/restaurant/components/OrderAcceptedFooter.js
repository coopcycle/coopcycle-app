import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next'
import {
  Footer,
  Icon, Text, Button,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'

import { resolveFulfillmentMethod } from '../../../utils/order'
import material from '../../../../native-base-theme/variables/material'

const styles = StyleSheet.create({
  footerBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  refuseBtn: {
    borderColor: material.brandDanger,
  },
  refuseBtnText: {
    color: material.brandDanger,
    fontWeight: 'bold',
  },
  delayBtn: {
    borderColor: '#333',
  },
  fulfillBtn: {
    borderColor: material.brandSuccess,
  },
  delayBtnText: {
    color: '#333',
    fontWeight: 'bold',
  },
  fulfillBtnText: {
    color: material.brandSuccess,
    fontWeight: 'bold',
  },
});

const OrderAcceptedFooter = ({ order, onPressCancel, onPressDelay, onPressFulfill }) => {

  const { t } = useTranslation()

  const fulfillmentMethod = resolveFulfillmentMethod(order)

  return (
    <Footer style={{ backgroundColor: '#fbfbfb' }}>
      <Grid>
        <Row>
          <Col style={{ padding: 10 }}>
            <TouchableOpacity
              style={ [ styles.footerBtn, styles.refuseBtn ] }
              onPress={ onPressCancel }>
              <Text style={ styles.refuseBtnText }>
                { t('RESTAURANT_ORDER_BUTTON_CANCEL') }
              </Text>
            </TouchableOpacity>
          </Col>
          <Col style={{ padding: 10 }}>
            <TouchableOpacity
              style={ [ styles.footerBtn, styles.delayBtn ] }
              onPress={ onPressDelay }>
              <Text style={ styles.delayBtnText }>
                { t('RESTAURANT_ORDER_BUTTON_DELAY') }
              </Text>
            </TouchableOpacity>
          </Col>
          { fulfillmentMethod === 'collection' && (
          <Col style={{ padding: 10 }}>
            <TouchableOpacity
              style={ [ styles.footerBtn, styles.fulfillBtn ] }
              onPress={ onPressFulfill }>
              <Text style={ styles.fulfillBtnText }>
                { t('RESTAURANT_ORDER_BUTTON_FULFILL') }
              </Text>
            </TouchableOpacity>
          </Col>
          )}
        </Row>
      </Grid>
    </Footer>
  )
}

export default OrderAcceptedFooter
