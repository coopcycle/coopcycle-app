import { InteractionManager } from "react-native";
import { ScrollView } from 'native-base';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { initialize } from "../../redux/Dispatch/actions";
import { selectSelectedDate, selectTaskLists } from "../../shared/logistics/redux";
import { selectUnassignedTasksNotCancelled } from "../../redux/Dispatch/selectors";
import { useAllTasks } from "./useAllTasks";
import GroupedTasks from "./components/GroupedTasks";


export default function AllTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();

  const selectedDate = useSelector(selectSelectedDate);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectTaskLists);

  const dispatch = useDispatch();

  const {
    isFetching,
    isError,
    refetch
  } = useAllTasks(selectedDate);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      dispatch(initialize());
    });
  }, [dispatch]);


  return (
    <ScrollView style={{ flex: 1 }}>
      <GroupedTasks
          tasks={unassignedTasks}
          title={'New orders'}
          navigation
          route
      />

      {taskLists.map(taskList => (
        <GroupedTasks
            tasks={taskList.items}
            title={taskList.username}
            navigation
            route
        />
      ))}
    </ScrollView>
  );
}
