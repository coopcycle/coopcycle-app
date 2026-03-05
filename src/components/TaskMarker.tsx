import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import FAIcon from './Icon';
import { Task } from '../types/task';
import { MessageCircle } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import chroma from 'chroma-js';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  centered: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  count: {
    color: '#fff',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 6,
  },
  absoluteCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

interface TaskMarkerProps {
  task: Task;
  count?: number;
  size?: number;
  testID?: string;
}

// Use NativeWind for styling

// https://www.nativewind.dev/docs/tailwind/svg/fill
cssInterop(Path, {
  className: {
    target: "style",
    nativeStyleToProp: { fill: true }
  },
});

cssInterop(FAIcon, {
  className: {
    target: false,
    nativeStyleToProp: { color: true }
  },
});

function getWarnings(task: Task, count: number = 1): object[] {

  const warnings: object[] = [];

  if (count > 1) {
    return warnings;
  }

  if (task.address?.description) {
    warnings.push({
      icon: MessageCircle,
    });
  }

  /*
  if (
    task.metadata?.payment_method &&
    isDisplayPaymentMethodInList(task.metadata?.payment_method)
  ) {
    warnings.push({
      icon: getIcon(task.metadata.payment_method),
    });
  }
  */

  return warnings;
}

const getOpacity = (task: Task, count: number = 1): number => {
  return count == 1 ? (['DONE', 'FAILED'].includes(task.status) ? 0.6 : 1) : 1;
};

const TaskMarkerBadge = ({ count }) => {

  return (
    <View style={[ styles.badge, { width: 15, height: 15 } ]}>
      {/* https://commons.wikimedia.org/wiki/File:Simple_red_circle.svg */}
      <Svg width={15} height={15} viewBox="0 0 20 20">
        <Circle cx={9.85} cy={10} r={9} fill="#df2c2c" />
      </Svg>
      <View style={styles.absoluteCenter}>
        <Text style={{ color: 'white', fontSize: 9 }}>{count}</Text>
      </View>
    </View>
  )
}

const getMarkerIconProps = (task: Task, count: number = 1) => {

  const isUnassigned = !task?.assignedTo;

  let backgroundProps = {
    className: 'fill-background-0',
    style: {}
  }
  let borderProps = {
    className: 'fill-outline-400',
    style: {}
  }
  let iconProps = {
    className: 'text-primary-800'
  };

  if (count > 1) { // Cluster marker

    backgroundProps = {
      ...backgroundProps,
      className: 'fill-info-200'
    }
    borderProps = {
      ...borderProps,
      className: 'fill-info-800'
    }

  } else { // Single marker

    const tagColor = task?.tags?.[0]?.color;

    if (tagColor) {

      // https://github.com/gka/chroma.js/issues/181
      const isTagColorDark = chroma(tagColor).get('lab.l') < 70
      const inverseColor = isTagColorDark ?
        chroma(tagColor).brighten(3).hex('rgb') : chroma(tagColor).darken(3).hex('rgb')

      // We can't use NativeWind for this,
      // as it won't be able to parse the dynamic className
      backgroundProps = {
        className: '',
        style: { fill: tagColor }
      }
      // Border color stays the same for all markers
      iconProps = {
        color: inverseColor
      }
    }

    /*
    if (isDarkMode) {
      // @TODO Is this really needed? Dark mode styles are handled diferently now (without requiring to manually define colors here)
      baseColor = isUnassigned ? '#414141' : '#000000';
      iconColor = tagColor || (isUnassigned ? '#9C9C9C' : '#FFFFFF');
      borderColor = lightenColor(iconColor, 80);
    } else {
      iconColor = tagColor || (isUnassigned ? '#A0A0A0' : '#000000');
      borderColor = tagColor || (isUnassigned ? '#A0A0A0' : '#000000');
    }
    */
  }

  return [backgroundProps, borderProps, iconProps];
}

const TaskMarker = ({ task, count = 1, size = 45, testID }: TaskMarkerProps) => {

  const iconName = task?.type === 'PICKUP' ? 'cube' : 'arrow-down';
  testID = testID || `taskmarker-${task?.id}`

  const warnings = getWarnings(task, count)
  const opacity = getOpacity(task, count);

  const [backgroundProps, borderProps, iconProps] = getMarkerIconProps(task, count);

  const getContainerTransform = () => {
    if (Platform.OS === 'ios') {
      return [{ translateY: -17 }, { translateX: 1 }];
    }
    return [{ translateY: 12 }];
  };

  return (
   <View style={[ styles.container, { transform: getContainerTransform(), opacity }]} testID={testID}>
      <Svg width={size} height={size * 1.4} viewBox="0 0 640 640">
        <Path
          d="M320 64C214 64 128 148.4 128 252.6C128 371.9 248.2 514.9 298.4 569.4C310.2 582.2 329.8 582.2 341.6 569.4C391.8 514.9 512 371.9 512 252.6C512 148.4 426 64 320 64z"
          // Border color of marker
          {...borderProps}
        />
        <Path
          d="M320 84C226 84 148 160 148 252C148 361 256 490 298 536C309 548 331 548 342 536C384 490 492 361 492 252C492 160 414 84 320 84z"
          // Background color of marker
          {...backgroundProps}
        />
      </Svg>
      <View style={[styles.centered, { width: size, height: size * 1.4 }]}>
        {count > 1 ? ( // Cluster marker
          <Text className="text-info-800" style={{ fontSize: size * 0.3 }}>{count}</Text>
        ) : ( // Single marker
          <FAIcon name={iconName} size={size * 0.3} {...iconProps} />
        )}
      </View>
      {warnings.length > 0 ? <TaskMarkerBadge count={warnings.length} /> : null}
    </View>
  );
};

export default TaskMarker;
