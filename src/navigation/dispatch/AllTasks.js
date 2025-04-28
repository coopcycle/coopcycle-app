import { ScrollView, View } from 'native-base';
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { InteractionManager, RefreshControl } from "react-native";
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
  primaryColor,
  whiteColor
} from '../../styles/common';
import { useColorModeToken } from '../../styles/theme';
import AddButton from './components/AddButton';

export default function AllTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();

  const selectedDate = useSelector(selectSelectedDate);
  const unassignedTasks = useSelector(selectUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectTaskLists);

  const dispatch = useDispatch();

  const screenBackgroundColor = useColorModeToken('#E6E2E2', '#131313');
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
      style={{ flex: 1, backgroundColor: screenBackgroundColor }}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={refetch} />
      }
      >
      {!isFetching &&
      <>
        <View>
          <AddButton
            testID="dispatchNewDelivery"
            onPress={() => navigation.navigate('DispatchNewDelivery')}>
            <Text style={{ fontWeight: '700' }}>
              {selectedDate.format('ll')}
            </Text>
          </AddButton>
        </View>
        <GroupedTasks
            backgroundColor={whiteColor}
            textColor={primaryColor}
            navigation
            route
            tasks={unassignedTasks}
            tasksType='unassignedTasks'
            title={t('UNASSIGNED_TASKS')}
        />
      {taskLists
        // commented this to show even if empty
        // .filter(taskList => taskList.items.length > 0)
        .map(taskList => (
        <GroupedTasks
            backgroundColor={taskList.color}
            textColor={'#000'}
            navigation
            route
            tasks={taskList.items}
            tasksType='taskList'
            title={`${taskList.username} (${taskList.items.length})`}
        />
      ))}
      </>}
    </ScrollView>
  );
}
