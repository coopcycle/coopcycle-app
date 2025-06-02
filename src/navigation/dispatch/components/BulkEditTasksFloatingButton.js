import _ from 'lodash';
import { Fab, Icon } from 'native-base';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { darkRedColor, whiteColor } from '../../../styles/common';

function BulkEditTasksFloatingButton({
  onPress,
  iconName
}, ref) {
  const [selectedTasks, setSelectedTasks] = useState({
    orders: {},
    tasks: {},
  });

  useImperativeHandle(ref, () => ({
      addOrder: (task, taskListId) => addItem(task, taskListId, true),
      addTask: (task, taskListId) => addItem(task, taskListId, false),
      removeOrder: (task, taskListId) => removeItem(task, taskListId, true),
      removeTask: (task, taskListId) => removeItem(task, taskListId, false),
    }
  ), [addItem, removeItem]);

  const addItem = useCallback((task, taskListId, isAssigningOrder) => {
    removeItem(task, taskListId, !isAssigningOrder);

    setSelectedTasks(prevSelectedTasks => {
      const { orders, tasks } = prevSelectedTasks;
      const itemsList = isAssigningOrder ? orders : tasks;
      const newItemsList = {...itemsList};

      if (!newItemsList[taskListId]) {
        newItemsList[taskListId] = [];
      }

      newItemsList[taskListId].push(task);

      return {
        orders: isAssigningOrder ? newItemsList : orders,
        tasks: !isAssigningOrder ? newItemsList : tasks,
      };
    });
  }, [removeItem]);

  const removeItem = useCallback((task, taskListId, isUnassigningOrder) => {
    setSelectedTasks(prevSelectedTasks => {
      const { orders, tasks } = prevSelectedTasks;
      const itemsList = isUnassigningOrder ? orders : tasks;
      const newItemsList = {...itemsList};
      const selectedTasksForTaskList = newItemsList[taskListId];

      if(!selectedTasksForTaskList) {
        return prevSelectedTasks;
      }

      newItemsList[taskListId] = selectedTasksForTaskList.filter(t => t.id !== task.id);

      if (newItemsList[taskListId].length === 0) {
        delete newItemsList[taskListId];
      }

      return {
        orders: isUnassigningOrder ? newItemsList : orders,
        tasks: !isUnassigningOrder ? newItemsList : tasks,
      };
    });
  }, []);

  const allSelectedTasks = useMemo(() => {
    const ordersByTaskList = selectedTasks.orders || {};
    const tasksByTaskList = selectedTasks.tasks || {};

    const orders = _.flatMap(Object.values(ordersByTaskList));
    const tasks = _.flatMap(Object.values(tasksByTaskList));

    return {
    orders,
    tasks,
  };
  }, [selectedTasks])

  return (
    <>
      {(allSelectedTasks.orders.length + allSelectedTasks.tasks.length) < 2 ? null : (
        <Fab
          renderInPortal={false}
          shadow={2}
          placement="bottom-right"
          onPress={() => onPress(allSelectedTasks)}
          bg={whiteColor}
          style={{
            marginBottom: 12,
            marginRight: 8,
            padding: 0,
            height: 94,
            width: 94
          }}
          icon={
            <Icon
              as={FontAwesome}
              name={iconName}
              size='4xl'
              color={darkRedColor}
              style={{ padding: 0}}
              testID="bulkAssignButton"
            />
          }
        />
      )}
    </>
  );
}

export default forwardRef(BulkEditTasksFloatingButton);
