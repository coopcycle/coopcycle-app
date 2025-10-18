import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import FAIcon from './Icon';
import { Task } from '../types/task';

// @TODO Is this function really needed? If yes, move it to a more generic util file
const lightenColor = (hex: string, amount: number = 80) => {
  try {
    let c = hex.startsWith('#') ? hex.slice(1) : hex;
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
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
    justifyContent: 'center',
    transform: [{ translateY: 12 }],
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
});

interface TaskMarkerProps {
  task?: Task;
  count?: number;
  size?: number;
  testID?: string;
}

const TaskMarker = ({ task, count = 1, size = 45, testID }: TaskMarkerProps) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const isUnassigned = !task?.assignedTo;
  const iconName = task?.type === 'PICKUP' ? 'cube' : 'arrow-down';
  testID = testID || `taskmarker-${task?.id}`

  let baseColor = '#FFFFFF';
  let borderColor = '#000000';
  let iconColor = '#000000';

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
  }

  return (
    <View style={styles.container} testID={testID}>
      <Svg width={size} height={size * 1.4} viewBox="0 0 640 640">
        <Path
          d="M320 64C214 64 128 148.4 128 252.6C128 371.9 248.2 514.9 298.4 569.4C310.2 582.2 329.8 582.2 341.6 569.4C391.8 514.9 512 371.9 512 252.6C512 148.4 426 64 320 64z"
          fill={borderColor}
        />
        <Path
          d="M320 84C226 84 148 160 148 252C148 361 256 490 298 536C309 548 331 548 342 536C384 490 492 361 492 252C492 160 414 84 320 84z"
          fill={baseColor}
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
    </View>
  );
};

export default TaskMarker;
