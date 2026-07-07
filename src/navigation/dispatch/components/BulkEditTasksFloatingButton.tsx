import { User } from 'lucide-react-native'
import { Fab, FabIcon } from '@/components/ui/fab';
import { useTaskListsContext } from '../../courier/contexts/TaskListsContext';

function BulkEditTasksFloatingButton({ onPress }) {
  const context = useTaskListsContext();
  const selectedTasks = context?.selectedTasksToEdit ?? [];

  if (selectedTasks.length < 2) return null;

  return (
    <Fab
      size="xxl"
      placement="bottom right"
      onPress={() => onPress(selectedTasks)}
      testID="bulkAssignButton"
    >
      <FabIcon as={User}/>
    </Fab>
  );
}

export default BulkEditTasksFloatingButton;
