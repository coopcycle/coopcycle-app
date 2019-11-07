import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  Container, Content,
  Icon, Text, Button,
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import material from '../../../native-base-theme/variables/material'

import { refuseOrder } from '../../redux/Restaurant/actions'

class BigButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {

    const danger = this.props.danger

    const btnStyles = [ styles.btn ]
    const btnTextHeadingStyles = [ styles.btnTextHeading ]
    const btnTextNoteStyles = []

    if (danger) {
      btnStyles.push(styles.btnDanger)
      btnTextHeadingStyles.push(styles.textDanger)
      btnTextNoteStyles.push(styles.textDanger)
    }

    const iconColor = danger ? material.brandDanger : '#ccc'

    return (
      <TouchableOpacity style={ btnStyles } onPress={ this.props.onPress }>
        <View>
          <Text style={ btnTextHeadingStyles }>
            { this.props.heading }
          </Text>
          <Text note style={ btnTextNoteStyles }>
            { this.props.text }
          </Text>
        </View>
        <Icon style={{ color: iconColor, alignSelf: 'center' }} name="ios-arrow-forward" />
      </TouchableOpacity>
    )
  }
}

class OrderRefuseScreen extends Component {

  componentDidUpdate(prevProps) {
    // Close the modal when loading has finished
    if (prevProps.loading === true && this.props.loading === false) {
      this.props.navigation.goBack()
    }
  }

  _refuseOrder(reason) {
    const { order } = this.props.navigation.state.params
    this.props.refuseOrder(this.props.httpClient, order, reason)
  }

  render() {

    const { navigate } = this.props.navigation

    return (
      <Container>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('RESTAURANT_ORDER_REFUSE_DISCLAIMER') }
          </Text>
        </View>
        <Content>
          <Grid style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20 }}>
            <Row style={{ marginBottom: 20 }}>
              <BigButton
                heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_SOLD_OUT_HEADING') }
                text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING')}` }
                onPress={ () => this._refuseOrder('SOLD_OUT') } />
            </Row>
            <Row style={{ marginBottom: 20 }}>
              <BigButton
                heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_RUSH_HOUR_HEADING') }
                text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_CONTINUE_RECEIVING')}` }
                onPress={ () => this._refuseOrder('RUSH_HOUR') } />
            </Row>
            <Row>
              <BigButton danger
                heading={ this.props.t('RESTAURANT_ORDER_REFUSE_REASON_CLOSING_HEADING') }
                text={ `${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_WILL_BE_REFUSED')}\n${this.props.t('RESTAURANT_ORDER_REFUSE_REASON_ORDER_STOP_RECEIVING')}` }
                onPress={ () => this._refuseOrder('CLOSING') } />
            </Row>
          </Grid>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
  },
  btnDanger: {
    borderColor: material.brandDanger,
  },
  btnTextHeading: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textDanger: {
    color: material.brandDanger,
  },
})

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    loading: state.restaurant.isFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    refuseOrder: (httpClient, order, reason) => dispatch(refuseOrder(httpClient, order, reason)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OrderRefuseScreen))
