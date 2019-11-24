import React, { Component } from 'react'
import {
  Container, Content,
  Left, Right, Body,
  List, ListItem, Icon, Text, Switch,
} from 'native-base'
import _ from 'lodash'
import moment from 'moment'

import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import { deleteOpeningHoursSpecification } from '../../redux/Restaurant/actions'

class OpeningHoursScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  renderItem(item) {
    return (
      <ListItem>
        <Left>
          <Text>{ item.name }</Text>
        </Left>
        <Right>
          <Switch
            value={ item.enabled }
            onValueChange={ this._toggleProductEnabled.bind(this, item) } />
        </Right>
      </ListItem>
    )
  }

  renderOpeningHours() {
    const { openingHoursSpecification } = this.props

    return (
      <List>
        <ListItem itemDivider>
          <Text>{ this.props.t('RESTAURANT_OPENING_HOURS') }</Text>
        </ListItem>
        { openingHoursSpecification.map(openingHoursSpecification => {

          let text = ''

          const baseParams = {
            opens: moment(openingHoursSpecification.opens, 'HH:mm').format('LT'),
            closes: moment(openingHoursSpecification.closes, 'HH:mm').format('LT'),
          }

          if (openingHoursSpecification.dayOfWeek.length === 1) {
            text = this.props.t('RESTAURANT_OPENING_HOURS_ONE_DAY', {
              ...baseParams,
              day: moment().isoWeekday(openingHoursSpecification.dayOfWeek[0]).format('dddd'),
            })
          } else {
            text = this.props.t('RESTAURANT_OPENING_HOURS_DAY_RANGE', {
              ...baseParams,
              firstDay: moment().isoWeekday(_.first(openingHoursSpecification.dayOfWeek)).format('dddd'),
              lastDay: moment().isoWeekday(_.last(openingHoursSpecification.dayOfWeek)).format('dddd'),
            })
          }

          return (
            <ListItem key={ JSON.stringify(openingHoursSpecification) }>
              <Text>{ text }</Text>
            </ListItem>
          )
        })}
      </List>
    )
  }

  renderSpecialOpeningHours() {
    const { specialOpeningHoursSpecification, httpClient } = this.props

    return (
      <List>
        <ListItem itemDivider>
          <Text>{ this.props.t('RESTAURANT_SPECIAL_OPENING_HOURS') }</Text>
        </ListItem>
        { specialOpeningHoursSpecification.map(openingHoursSpecification => {
          const { validFrom, validThrough } = openingHoursSpecification
          return (
            <ListItem icon key={ JSON.stringify(openingHoursSpecification) }
              onPress={ () => this.props.deleteOpeningHoursSpecification(httpClient, openingHoursSpecification) }>
              <Body>
                <Text>{ this.props.t('RESTAURANT_OPENING_HOURS_VALID_FROM_THROUGH', {
                  validFrom: moment(validFrom, 'YYYY-MM-DD').format('ll'),
                  validThrough: moment(validThrough, 'YYYY-MM-DD').format('ll') }) }</Text>
              </Body>
              <Right>
                <Icon active name="close" />
              </Right>
            </ListItem>
          )
        })}
      </List>
    )
  }

  render() {

    return (
      <Container>
        <Content>
          { this.renderOpeningHours() }
          { this.renderSpecialOpeningHours() }
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {

  const { restaurant: restaurantState } = state
  const { restaurant, specialOpeningHoursSpecification } = restaurantState

  return {
    httpClient: state.app.httpClient,
    openingHoursSpecification: restaurant.openingHoursSpecification,
    restaurant,
    specialOpeningHoursSpecification,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    deleteOpeningHoursSpecification: (httpClient, openingHoursSpecification) =>
      dispatch(deleteOpeningHoursSpecification(httpClient, openingHoursSpecification)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withTranslation()(OpeningHoursScreen))
