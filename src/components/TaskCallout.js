import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'native-base'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import TaskTitle from './TaskTitle'

const Recipient = ({ task }) => {
  if (task.address.contactName) {
    return (
      <Text color="black" style={ styles.text }>{ task.address.contactName }</Text>
    )
  }

  return null
}

const Address = ({ task }) => {

  const parts = [task.address.streetAddress]

  if (task.address.complement) {
    parts.push(task.address.complement)
  }

  if (task.address.name) {
    parts.unshift(task.address.name)
  }

  return (
    <Text color="black" style={ styles.text } numberOfLines={ 3 }>
      { parts.join(' - ') }
    </Text>
  )
}

const Tag = ({ tag }) => (
  <View style={ [ styles.tag, { backgroundColor: tag.color }] } />
)

export default ({ task, warnings }) => {
  return (
    <View>
      <View style={ styles.container }>
        <Text color="black"><TaskTitle task={ task } /></Text>
        <Recipient task={ task } />
        <Address task={ task } />
      </View>
      <View style={ styles.tags }>
      {
        task.tags.map((tag, index) => (
          <Tag key={ index } tag={ tag } />
        ))
      }
      </View>
      <View style={ styles.warning }>
        { warnings.map((warning, index) => <Icon key={index} as={FontAwesome} name={warning} size="xs"/>) }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    borderRadius: 7,
    width: 14,
    height: 14,
    margin: 2,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
