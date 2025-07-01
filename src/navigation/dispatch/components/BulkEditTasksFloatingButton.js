import _ from 'lodash';
import { Fab, Icon } from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedTasks } from '../../../redux/Dispatch/selectors';
import { darkRedColor, whiteColor } from '../../../styles/common';

function BulkEditTasksFloatingButton({ onPress, iconName }) {
  const selectedTasks = useSelector(selectSelectedTasks);

  const allSelectedTasks = useMemo(() => {
    const ordersByTaskList = selectedTasks.orders || {};
    const tasksByTaskList = selectedTasks.tasks || {};

    const orders = _.flatMap(Object.values(ordersByTaskList));
    const tasks = _.flatMap(Object.values(tasksByTaskList));

    return [...tasks, ...orders];
  }, [selectedTasks]);

  const handleOnPress = () => {
    onPress(selectedTasks);
  };

  return (
    <>
      {allSelectedTasks.length < 2 ? null : (
        <Fab
          renderInPortal={false}
          shadow={2}
          placement="bottom-right"
          onPress={handleOnPress}
          bg={whiteColor}
          style={{
            marginBottom: 12,
            marginRight: 8,
            padding: 0,
            height: 94,
            width: 94,
          }}
          icon={
            <Icon
              as={FontAwesome}
              name={iconName}
              size="4xl"
              color={darkRedColor}
              style={{ padding: 0 }}
              testID="bulkAssignButton"
            />
          }
        />
      )}
    </>
  );
}

export default BulkEditTasksFloatingButton;
