import { Fab, Icon } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { whiteColor } from '../../../styles/common';
import { useState } from 'react';

function BulkEditTasksFloatingButton({ onPressed, iconName }) {
  const [selectedTasks, setSelectedTasks] = useState({});

  const addItem = (task, taskListId) => {
    const newSelectedTasks = {...selectedTasks}
    if (!newSelectedTasks[taskListId]) {
      
    }
    if (selectedTasks.some(i => i.id === task.id)) {
      return;
    }
    setSelectedTasks({
      items: [...selectedTasks.items, task],
    });
  }

  removeItem(item) {
    this.setState({
      items: this.state.items.filter(i => i.id !== item.id),
    });
  }

  return (
    <>
      <Fab
        renderInPortal={false}
        shadow={2}
        placement="bottom-right"
        onPress={onPressed}
        style={{
          width: 80,
          height: 80,
          marginBottom: 12,
          marginRight: 8,
        }}
        icon={
          <Icon
            as={FontAwesome}
            name={iconName}
            color={whiteColor}
            size="lg"
            testID="bulkAssignButton"
            style={{ marginStart: 10 }}
          />
        }
      />
    </>
  );
}
export default BulkEditTasksFloatingButton;
