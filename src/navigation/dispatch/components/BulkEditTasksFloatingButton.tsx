import _ from 'lodash';
import { User } from 'lucide-react-native'
import { Fab, FabIcon } from '@/components/ui/fab';
import { Check } from 'lucide-react-native'

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedTasks } from '../../../redux/Dispatch/selectors';

function BulkEditTasksFloatingButton({ onPress }) {
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
          size="xl"
          placement="bottom right"
          onPress={handleOnPress}
        >
          <FabIcon as={User} />
        </Fab>
      )}
    </>
  );
}

export default BulkEditTasksFloatingButton;
