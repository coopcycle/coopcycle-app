import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SwipeRow } from 'react-native-swipe-list-view';

import { greenColor, redColor, yellowColor } from '../../../styles/common';
import { DoneIcon, FailedIcon } from '../styles/common';

const LeftButton = ({ width }) => (
  <View
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon as={DoneIcon} size={24} style={{ color: '#fff' }} />
  </View>
);

const RightButton = ({ width }) => (
  <View
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center', width }}>
    <Icon as={FailedIcon} size={24} style={{ color: '#fff' }} />
  </View>
);

const CompleteButton = React.forwardRef((props, ref) => {
  const { task, onPressSuccess, onPressFailure, t } = props;

  const { width } = Dimensions.get('window');

  if (task.status === 'DONE') {
    return (
      <View style={[styles.buttonContainer, { backgroundColor: greenColor }]}>
        <View style={styles.buttonTextContainer}>
          <Icon
            as={DoneIcon}
            size="xl"
            style={{ color: '#fff', marginRight: 10 }}
          />
          <Text style={{ color: '#fff' }}>{t('COMPLETED')}</Text>
        </View>
      </View>
    );
  }

  if (task.status === 'FAILED') {
    return (
      <View style={[styles.buttonContainer, { backgroundColor: redColor }]}>
        <View style={styles.buttonTextContainer}>
          <Icon
            as={FailedIcon}
            size="xl"
            style={{ color: '#fff', marginRight: 10 }}
          />
          <Text style={{ color: '#fff' }}>{t('FAILED')}</Text>
        </View>
      </View>
    );
  }

  const buttonWidth = width / 3;

  return (
    <View>
      <HStack className="px-3 py-2">
        <Text fontSize="xs" color="muted.500">
          {t('SWIPE_TO_END')}
        </Text>
      </HStack>
      <SwipeRow
        leftOpenValue={buttonWidth}
        stopLeftSwipe={buttonWidth + 25}
        rightOpenValue={buttonWidth * -1}
        stopRightSwipe={(buttonWidth + 25) * -1}
        ref={ref}>
        <View style={styles.rowBack}>
          <TouchableOpacity
            testID="task:completeSuccessButton"
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center',
              backgroundColor: greenColor,
              width: buttonWidth,
            }}
            onPress={onPressSuccess}>
            <LeftButton width={buttonWidth} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="task:completeFailureButton"
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
              backgroundColor: yellowColor,
              width: buttonWidth,
            }}
            onPress={onPressFailure}>
            <RightButton width={buttonWidth} />
          </TouchableOpacity>
        </View>
        <Box
          className="bg-secondary-600"
          style={{ padding: 28, width }}
          testID="task:completeButton">
          <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff' }}>
            {t('COMPLETE_TASK')}
          </Text>
        </Box>
      </SwipeRow>
    </View>
  );
});

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
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default withTranslation(['common'], { withRef: true })(CompleteButton);
