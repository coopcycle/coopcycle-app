import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  Container, Content, Body, Right,
  Card, CardItem,
  Icon, Text, Button
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import LoaderOverlay from '../../components/LoaderOverlay'
import { loadMyRestaurants } from '../../redux/Restaurant/actions'

class ListScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount() {
    this.props.loadMyRestaurants(this.props.httpClient)
  }

  renderRestaurants() {

    const { navigate } = this.props.navigation
    const { restaurants } = this.props

    return (
      <View>
        { restaurants.map(restaurant =>
          <Card key={ restaurant['@id'] }>
            <CardItem button onPress={ () => navigate('RestaurantDashboard', { restaurant }) }>
              <Body>
                <Text>{ restaurant.name }</Text>
              </Body>
            </CardItem>
          </Card>
        ) }
      </View>
    )
  }

  render() {
    return (
      <Container>
        <Content style={ styles.content }>
          <View style={ styles.helpContainer }>
            <Text style={ styles.helpText }>
              { this.props.i18n.t('RESTAURANT_LIST_CLICK_BELOW') }
            </Text>
          </View>
          { this.renderRestaurants() }
        </Content>
        <LoaderOverlay loading={ this.props.loading } />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  helpContainer: {
    paddingVertical: 10
  },
  helpText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center'
  }
})

function mapStateToProps(state) {
  return {
    user: state.app.user,
    httpClient: state.app.httpClient,
    loading: state.restaurant.isFetching,
    restaurants: state.restaurant.myRestaurants,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadMyRestaurants: (client) => dispatch(loadMyRestaurants(client)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(ListScreen))
