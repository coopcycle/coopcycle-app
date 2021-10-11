import React from 'react'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, Icon } from 'native-base'
import { SwipeRow } from 'react-native-swipe-list-view'
import { withTranslation } from 'react-i18next'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { greenColor, redColor } from '../../../styles/common'
import {
  doneIconName,
  failedIconName,
} from '../styles/common'

const LeftButton = ({ width }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon as={FontAwesome} name={ doneIconName } style={{ color: '#fff' }} />
  </View>
)

const RightButton = ({ width }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon as={FontAwesome} name={ failedIconName } style={{ color: '#fff' }} />
  </View>
)

const CompleteButton = React.forwardRef((props, ref) => {

  const { task, onPressSuccess, onPressFailure, t } = props

  const { width } = Dimensions.get('window')

  if (task.status === 'DONE') {

    return (
      <View style={ [ styles.buttonContainer, { backgroundColor: greenColor } ] }>
        <View style={ styles.buttonTextContainer }>
          <Icon as={FontAwesome} name={ doneIconName } style={{ color: '#fff', marginRight: 10 }} />
          <Text style={{ color: '#fff' }}>{ t('COMPLETED') }</Text>
        </View>
      </View>
    )
  }

  if (task.status === 'FAILED') {

    return (
      <View style={ [ styles.buttonContainer, { backgroundColor: redColor } ] }>
        <View style={ styles.buttonTextContainer }>
          <Icon as={FontAwesome} name={ failedIconName } style={{ color: '#fff', marginRight: 10 }} />
          <Text style={{ color: '#fff' }}>{ t('FAILED') }</Text>
        </View>
      </View>
    )
  }

  const buttonWidth = (width / 3)

  return (
    <View>
      <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
        <Text style={styles.swipeOutHelpText}>{ t('SWIPE_TO_END') }</Text>
      </View>
      <SwipeRow
        leftOpenValue={ buttonWidth }
        stopLeftSwipe={ buttonWidth + 25 }
        rightOpenValue={ buttonWidth * -1 }
        stopRightSwipe={ (buttonWidth + 25) * -1 }
        ref={ ref }>
        <View style={ styles.rowBack }>
          <TouchableOpacity
            testID="task:completeSuccessButton"
            style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: greenColor, width: buttonWidth }}
            onPress={ onPressSuccess }>
            <LeftButton width={ buttonWidth } />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', backgroundColor: redColor, width: buttonWidth }}
            onPress={ onPressFailure }>
            <RightButton width={ buttonWidth } />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 28, width, backgroundColor: '#dedede' }} testID="task:completeButton">
          <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Raleway-Regular' }}>
            { t('COMPLETE_TASK') }
          </Text>
        </View>
      </SwipeRow>
    </View>
  )
})

const styles = StyleSheet.create({
  buttonContainer: {
    height: '10%',
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  swipeOutHelpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  swipeOutHelpText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#ccc',
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default withTranslation([ 'common' ], { withRef: true })(CompleteButton)
