import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions, StyleSheet, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { greenColor, redColor, yellowColor } from '../../../styles/common';
import { DoneIcon, FailedIcon } from '../styles/common';

const swipeActionWidth = 90;

function LeftAction({ prog, drag, onPress }) {

  const styleAnimation = useAnimatedStyle(() => {

    return {
      transform: [{ translateX: drag.value - swipeActionWidth }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Pressable
        className="items-center justify-center"
        style={{ flex: 1, width: swipeActionWidth, backgroundColor: greenColor }}
        testID="task:completeSuccessButton"
        onPress={onPress}>
        <Icon as={DoneIcon} size={24} style={{ color: '#fff' }} />
      </Pressable>
    </Reanimated.View>
  );
}

function RightAction({ prog, drag, onPress }) {

  const styleAnimation = useAnimatedStyle(() => {

    return {
      transform: [{ translateX: drag.value + swipeActionWidth }],
    };
  });

  return (
    <Reanimated.View style={styleAnimation}>
      <Pressable
        className="items-center justify-center"
        style={{ flex: 1, width: swipeActionWidth, backgroundColor: yellowColor }}
        testID="task:completeFailureButton"
        onPress={onPress}
        >
        <Icon as={FailedIcon} size={24} style={{ color: '#fff' }} />
      </Pressable>
    </Reanimated.View>
  );
}

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
      <Swipeable
        ref={ref}
        containerStyle={styles.swipeable}
        friction={2}
        enableTrackpadTwoFingerGesture
        rightThreshold={40}
        renderLeftActions={(prog, drag) => {
          return (<LeftAction prog={prog} drag={drag} onPress={onPressSuccess} />);
        }}
        renderRightActions={(prog, drag) => {
          return (<RightAction prog={prog} drag={drag} onPress={onPressFailure} />);
        }}
      >
        <Box testID="task:completeButton" className="flex-1 w-full justify-center items-center bg-secondary-600" style={{ width }}>
          <Text size="lg">{t('COMPLETE_TASK')}</Text>
        </Box>
      </Swipeable>
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
  swipeable: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withTranslation(['common'], { withRef: true })(CompleteButton);
