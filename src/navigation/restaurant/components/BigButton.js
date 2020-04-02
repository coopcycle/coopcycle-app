import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Icon, Text } from 'native-base'
import material from '../../../../native-base-theme/variables/material'

export default ({ heading, text, onPress, danger }) => {

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
    <TouchableOpacity style={ btnStyles } onPress={ onPress }>
      <View>
        <Text style={ btnTextHeadingStyles }>
          { heading }
        </Text>
        <Text note style={ btnTextNoteStyles }>
          { text }
        </Text>
      </View>
      <Icon style={{ color: iconColor, alignSelf: 'center' }} name="ios-arrow-forward" />
    </TouchableOpacity>
  )

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
