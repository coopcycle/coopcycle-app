import { useNavigation, useRoute } from '@react-navigation/native';
import { useTaskListsContext } from '@/src/navigation/courier/contexts/TaskListsContext';

export const useNavigateOnSuccess = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const TaskListsContext = useTaskListsContext();

  const navigateOnSuccess = () => {
    TaskListsContext?.clearSelectedTasks();
    if (route.params?.navigateAfter !== null) {
      navigation.navigate({
        name: route.params?.navigateAfter,
        merge: true,
      });
    } else {
      navigation.goBack();
    }
  };

  return navigateOnSuccess;
};
