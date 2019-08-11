import React, { Component } from 'react'
import { FlatList, StyleSheet, Viewr } from 'react-native'
import { Container, Icon, Text } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import moment from 'moment'
import { withTranslation } from 'react-i18next'
import _ from 'lodash'

class TaskHistoryPage extends Component {

  constructor(props) {
    super(props)
  }

  renderEvent(event) {
    return (
      <Grid style={ styles.row }>
        <Row>
          <Col>
            <Text>{ event.name }</Text>
          </Col>
          <Col>
            <Text style={{ textAlign: 'right' }}>{ moment(event.createdAt).fromNow() }</Text>
          </Col>
        </Row>
        { event.notes &&
          <Row style={{ paddingTop: 10 }}>
            <Col style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
              <Icon name="chatbubbles" style={{ fontSize: 18, marginRight: 10, color: '#ccc' }} />
              <Text style={{ fontSize: 14, color: '#ccc' }}>{ event.notes }</Text>
            </Col>
          </Row>
        }
      </Grid>
    )
  }

  render() {

    const { task } = this.props.navigation.state.params
    const events = _.reverse(_.sortBy(task.events, [ event => moment(event.createdAt) ]))

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <FlatList
          data={ events }
          keyExtractor={ (item, index) => item.createdAt }
          renderItem={ ({ item }) => this.renderEvent(item) } />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    padding: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

module.exports = withTranslation()(TaskHistoryPage)
