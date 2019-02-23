import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Icon, Text, Button
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import material from '../../../native-base-theme/variables/material'

import { delayOrder } from '../../redux/Restaurant/actions'

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
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Icon style={{ color: iconColor, marginRight: 20 }} name="md-clock" />
          <Text style={ btnTextHeadingStyles }>
            { this.props.heading }
          </Text>
        </View>
        <Icon style={{ color: iconColor }} name="ios-arrow-forward" />
      </TouchableOpacity>
    )
  }
}

class OrderDelayScreen extends Component {

  componentWillReceiveProps(newProps) {
    // Close the modal when loading has finished
    if (this.props.loading === true && newProps.loading === false) {
      this.props.navigation.goBack()
    }
  }

  _delayOrder(delay) {
    const { order } = this.props.navigation.state.params
    this.props.delayOrder(this.props.httpClient, order, delay)
  }

  render() {
    return (
      <Container
        navigation={ this.props.navigation }
        title={ this.props.t('RESTAURANT_ORDER_DELAY_MODAL_TITLE') }>
        <View style={{ padding: 20 }}>
          <Text note>
            { this.props.t('RESTAURANT_ORDER_DELAY_DISCLAIMER') }
          </Text>
        </View>
        <Content>
          <Grid style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20 }}>
            <Row style={{ marginBottom: 20 }}>
              <BigButton
                heading={ '10 minutes' }
                onPress={ () => this._delayOrder(10) } />
            </Row>
            <Row style={{ marginBottom: 20 }}>
              <BigButton
                heading={ '20 minutes' }
                onPress={ () => this._delayOrder(20) } />
            </Row>
            <Row>
              <BigButton danger
                heading={ '30 minutes' }
                onPress={ () => this._delayOrder(30) } />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  btnDanger: {
    borderColor: material.brandDanger,
  },
  btnTextHeading: {
    fontWeight: 'bold',
  },
  textDanger: {
    color: material.brandDanger,
  }
})

function mapStateToProps(state) {
  return {
    httpClient: state.app.httpClient,
    loading: state.restaurant.isFetching,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    delayOrder: (httpClient, order, delay) => dispatch(delayOrder(httpClient, order, delay)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(OrderDelayScreen))
