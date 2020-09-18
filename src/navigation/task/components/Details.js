import React from 'react'
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native'
import { withTranslation } from 'react-i18next'
import { Button, Icon, Text } from 'native-base'
import { showLocation } from 'react-native-map-link'
import { phonecall } from 'react-native-communications'
import moment from 'moment'
import { Col, Row } from 'react-native-easy-grid'

const Detail = ({ item }) => {

  const { iconName, text, component, onPress } = item

  let touchableOpacityProps = {}
  if (onPress) {
    touchableOpacityProps = { onPress }
  }

  const body = (
    <Col size={ onPress ? 7 : 8 }>
      { text ? (<Text style={ styles.taskDetailText }>{ text }</Text>) : null }
      { component && component }
    </Col>
  )

  return (
    <TouchableOpacity style={{ flex:  1 }} { ...touchableOpacityProps }>
      <Row style={ styles.row }>
        <Col size={ 2 } style={ styles.iconContainer }>
          <Icon name={ iconName } style={{ color: '#ccc' }} />
        </Col>
        { body }
        { onPress &&
        <Col size={ 1 }>
          <Icon name="arrow-forward" style={{ color: '#ccc' }} />
        </Col> }
      </Row>
    </TouchableOpacity>
  )
}

const Details = ({ task, t }) => {

  const timeframe = moment(task.doneAfter).format('LT') + ' - ' + moment(task.doneBefore).format('LT')
  let address = task.address.name ? [ task.address.name, task.address.streetAddress ].join(' - ') : task.address.streetAddress
  const name = [ task.address.firstName, task.address.lastName ].filter(function (item) {return item}).join(' ')
  address = name ? [ name, address ].join(' - ') : address

  const items = [
    {
      iconName: 'navigate',
      text: address,
      onPress: () => showLocation({
        latitude: task.address.geo.latitude,
        longitude: task.address.geo.longitude,
        dialogTitle: t('OPEN_IN_MAPS_TITLE'),
        dialogMessage: t('OPEN_IN_MAPS_MESSAGE'),
        cancelText: t('CANCEL'),
      }),
    },
    {
      iconName: 'time',
      text: timeframe,
    },
  ]

  if (task.address.telephone) {
    items.push({
      iconName: 'call',
      text: task.address.telephone,
      onPress: () => phonecall(task.address.telephone, true),
    })
  }

  if (task.comments) {
    items.push({
      iconName: 'chatbubbles',
      text: task.comments,
    })
  }

  if (task.address.description) {
    items.push({
      iconName: 'information-circle',
      text: task.address.description,
    })
  }

  if (task.tags.length > 0) {
    items.push({
      iconName: 'star',
      component: (
        <View style={{ flex: 1, flexDirection: 'row' }}>
        { task.tags.map(tag => (
          <Button style={{ backgroundColor: tag.color, marginRight: 5 }} key={ tag.slug } small disabled>
            <Text style={{ fontSize: 10 }}>{ tag.slug }</Text>
          </Button>
        )) }
        </View>
      ),
    })
  }

  return (
    <FlatList
      data={ items }
      keyExtractor={ (item, index) => item.iconName }
      renderItem={ ({ item }) => <Detail item={ item } /> }
      ItemSeparatorComponent={ () => (
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: '#ccc',
          }}
        />
      )} />
  )
}

const styles = StyleSheet.create({
  taskDetailText: {
    fontSize: 12,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  row: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default withTranslation()(Details)
