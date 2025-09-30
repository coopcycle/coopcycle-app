import { View } from 'react-native';

import {
  doingIconName,
  doneIconName,
  failedIconName,
} from '../navigation/task/styles/common';
import { greenColor, redColor } from '../styles/common';
import { Task } from '../types/task.ts';
import FAIcon from './Icon';

export const TaskStatusIcon = ({ task }: { task: Task }) => {
  const testID = `taskListItemIcon:${task.status}:${task.id}`;

  // We wrap the element in a <View>,
  // to avoid Detox sayins "matches 2 views in the hierarchy"
  // because the "testID" prop is propagated to the child elements

  switch (task.status) {
    case 'DOING':
      return (
        <FAIcon
          name={doingIconName}
          color="#2C81CC"
          size={20}
          testID={testID}
        />
      );
    case 'DONE':
      return <FAIcon name={doneIconName} color={greenColor} testID={testID} />;
    case 'FAILED':
      return <FAIcon name={failedIconName} color={redColor} testID={testID} />;
    default:
      return <View />;
  }
};