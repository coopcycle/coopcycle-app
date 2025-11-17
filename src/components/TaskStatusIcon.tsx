import { View } from 'react-native';
import {
  doingIconName,
  doneIconName,
  failedIconName,
  incidentIconName,
} from '../navigation/task/styles/common';
import { greenColor, redColor } from '../styles/common';
import { Task } from '../types/task.ts';
import FAIcon from './Icon';

export const TaskStatusIcon = ({ task }: { task: Task }) => {
  const testID = `taskListItemIcon:${task.status}:${task.id}`;

  const renderIcon = () => {
    switch (task.status) {
      case 'DOING':
        return <FAIcon name={doingIconName} color="#2C81CC" testID={testID} size={20} />;
      case 'DONE':
        return <FAIcon name={doneIconName} color={greenColor} testID={testID} />;
      case 'FAILED':
        return <FAIcon name={failedIconName} color={redColor} testID={testID} />;
      default:
        return null;
    }
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap:4 }}>
      {task.hasIncidents && <Incident task={task}/>}
      {renderIcon()}
    </View>
  )
};

const Incident = ({task}: {task: Task}) => {
  return (
    <View
      testID={`taskListItemIcon:INCIDENT:${task.id}`}
      accessible={true}
      accessibilityLabel={`Incident icon for task ${task.id}`}
    >
      <FAIcon
        name={incidentIconName}
        size={16}
      />
    </View>
  );
};
