import { ActivityIndicator, InteractionManager } from "react-native";
import {
  Center,
  Heading,
  Text,
  View
} from 'native-base';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { initialize } from "../../redux/Dispatch/actions";
import { mediumGreyColor } from '../../styles/common';
import { selectFilteredTaskLists, selectFilteredUnassignedTasksNotCancelled } from '../../shared/src/logistics/redux/selectors';
import { selectSelectedDate } from "../../shared/logistics/redux";
import { useAllTasks } from "./useAllTasks";
import AddButton from './components/AddButton';
import BasicSafeAreaView from '../../components/BasicSafeAreaView';
import GroupedTasks from "./components/GroupedTasks";

export default function AllTasks({
  navigation,
  route,
}) {
  const { t } = useTranslation();

  const selectedDate = useSelector(selectSelectedDate);
  const unassignedTasks = useSelector(selectFilteredUnassignedTasksNotCancelled);
  const taskLists = useSelector(selectFilteredTaskLists);

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

  if (isFetching) {
    return (
      <Center w="95%" h="80%">
        <ActivityIndicator animating={true} size="large" />
      </Center>
    )
  }

  return (
    <BasicSafeAreaView>
        <View style={{ backgroundColor: mediumGreyColor }}>
          <AddButton
            testID="dispatchNewDelivery"
            onPress={() => navigation.navigate('DispatchNewDelivery')}>
            <Text style={{ fontWeight: '700' }}>
              {selectedDate.format('ll')}
            </Text>
          </AddButton>
        </View>
        <GroupedTasks
          isFetching={isFetching}
          refetch={refetch}
          route={route}
          taskLists={taskLists}
          unassignedTasks={unassignedTasks}
        />
      </BasicSafeAreaView>
  );
}
