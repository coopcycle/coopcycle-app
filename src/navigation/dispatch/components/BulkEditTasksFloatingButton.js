import { Fab, Icon } from 'native-base';
import { forwardRef, useImperativeHandle, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { whiteColor } from '../../../styles/common';

function BulkEditTasksFloatingButton({ onPressed, iconName, ref }) {
  const [selectedTasks, setSelectedTasks] = useState({});

  useImperativeHandle(ref, () => {
    return {
      addItem: (task, taskListId) => {
        const newSelectedTasks = {...selectedTasks};

        if (!newSelectedTasks[taskListId]) {
          newSelectedTasks[taskListId] = [];
        }

        if (newSelectedTasks[taskListId].some(i => i.id === task.id)) {
          return;
        }

        newSelectedTasks[taskListId].push(task);
        setSelectedTasks(newSelectedTasks);
      },
      removeItem: (task, taskListId) => {
        const newSelectedTasks = {...selectedTasks};

        newSelectedTasks[taskListId] = newSelectedTasks[taskListId].filter(t => t.id !== task.id);

        if (newSelectedTasks[taskListId].length === 0) {
          delete newSelectedTasks[taskListId];
        }

        setSelectedTasks(newSelectedTasks);
      }
    }
  }, [selectedTasks]);

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

export default forwardRef(BulkEditTasksFloatingButton);
