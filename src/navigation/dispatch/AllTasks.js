import { ScrollView } from 'native-base';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InteractionManager, RefreshControl, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { initialize } from "../../redux/Dispatch/actions";
import { selectUnassignedTasksNotCancelled } from "../../redux/Dispatch/selectors";
import { selectSelectedDate, selectTaskLists } from "../../shared/logistics/redux";
import GroupedTasks from "./components/GroupedTasks";
import { useAllTasks } from "./useAllTasks";

import {
  Center,
  Heading,
  Text
} from 'native-base';

import {
  dateSelectHeaderHeight,
  headerFontSize,
  primaryColor,
  whiteColor,
} from '../../styles/common';

let styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dateHeader: {
    backgroundColor: primaryColor,
    height: dateSelectHeaderHeight,
    alignItems: 'center',
    flexDirection: 'row',
  },
  dateHeaderText: {
    color: whiteColor,
    paddingHorizontal: 15,
    fontSize: headerFontSize,
  },
  icon: {
    color: whiteColor,
    fontSize: 32,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayContainer: {
    backgroundColor: whiteColor,
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 4,
  },
  todayButton: {
    color: primaryColor,
    fontSize: 18,
    fontWeight: '300',
  },
});


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

  if (isError) {
    return (
      <Center w="95%" h="80%">
        <Heading>{t('AN_ERROR_OCCURRED')} </Heading>
        <Text>{t('TRY_LATER')}</Text>
      </Center>
    );
  }

  return (
    <ScrollView 
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      >
      {!isFetching &&
      <>
        <GroupedTasks
            backgroundColor={whiteColor}
            textColor={primaryColor}
            navigation
            route
            tasks={unassignedTasks}
            title={t('UNASSIGNED_TASKS')}
        />
      {taskLists
        .filter(taskList => taskList.items.length > 0)
        .map(taskList => (
        <GroupedTasks
            backgroundColor={taskList.color}
            textColor={'#000'}
            navigation
            route
            tasks={taskList.items}
            title={taskList.username}
        />
      ))}
      </>}
    </ScrollView>
  );
}
