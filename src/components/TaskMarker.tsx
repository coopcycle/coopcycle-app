import React from 'react';
import { StyleSheet, Text, View, useColorScheme, Platform } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import FAIcon from './Icon';
import { Task } from '../types/task';
import { MessageCircle } from 'lucide-react-native';
import { cssInterop } from 'nativewind';

// @TODO Is this function really needed? If yes, move it to a more generic util file
const lightenColor = (hex: string, amount: number = 80) => {
  try {
    let c = hex.startsWith('#') ? hex.slice(1) : hex;
    let b = (num & 0x0000ff) + amount;
    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
};

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

function getWarnings(task: Task) {

  const warnings = [];

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

const getTaskOpacity = (task: Task): number => {
  return ['DONE', 'FAILED'].includes(task.status) ? 0.6 : 1;
};

// Use NativeWind to style SVG
// https://www.nativewind.dev/docs/tailwind/svg/fill
cssInterop(Path, {
  className: {
    target: "style",
    nativeStyleToProp: { fill: true }
  },
});

const TaskMarker = ({ task, count = 1, size = 45, testID }: TaskMarkerProps) => {

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const isUnassigned = !task?.assignedTo;
  const iconName = task?.type === 'PICKUP' ? 'cube' : 'arrow-down';
  testID = testID || `taskmarker-${task?.id}`

  let baseColor = '#FFFFFF';
  let borderColor = '#000000';
  let iconColor = '#000000';
  let warnings = []
  let opacity = 1;

  if (count > 1) { // Cluster marker
    baseColor = '#1E88E5';
    borderColor = lightenColor(baseColor, 70);
  } else { // Single marker
    const tagColor = task?.tags?.[0]?.color;
    if (isDarkMode) {
      // @TODO Is this really needed? Dark mode styles are handled diferently now (without requiring to manually define colors here)
      baseColor = isUnassigned ? '#414141' : '#000000';
      iconColor = tagColor || (isUnassigned ? '#9C9C9C' : '#FFFFFF');
      borderColor = lightenColor(iconColor, 80);
    } else {
      iconColor = tagColor || (isUnassigned ? '#A0A0A0' : '#000000');
      borderColor = tagColor || (isUnassigned ? '#A0A0A0' : '#000000');
    }

    warnings = getWarnings(task);
    opacity = getTaskOpacity(task);
  }

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
          className="fill-outline-400"
        />
        <Path
          d="M320 84C226 84 148 160 148 252C148 361 256 490 298 536C309 548 331 548 342 536C384 490 492 361 492 252C492 160 414 84 320 84z"
          // Background color of marker
          className="fill-background-0"
        />
      </Svg>
      <View style={[styles.centered, { width: size, height: size * 1.4 }]}>
        <Text style={[styles.count, { fontSize: size * 0.35 }]}>
          {count > 1 ? ( // Cluster marker
            count
          ) : ( // Single marker
            <FAIcon name={iconName} color={iconColor} size={size * 0.3} />
          )}
        </Text>
      </View>
      {warnings.length > 0 ? <TaskMarkerBadge count={warnings.length} /> : null}
    </View>
  );
};

export default TaskMarker;
