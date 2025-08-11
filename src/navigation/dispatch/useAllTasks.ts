import { useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import moment from 'moment';

import {
  loadTaskListsFailure,
  loadTaskListsSuccess,
  loadTasksFailure,
  loadTasksSuccess,
  loadUsersFailure,
  loadUsersSuccess,
} from '../../redux/Dispatch/actions';
import {
  useGetCourierUsersQuery,
  useGetTaskListsV2Query,
  useGetTasksQuery,
  useGetToursQuery,
} from '../../redux/api/slice';
import {
  loadToursFailure,
  loadToursSuccess,
} from '../../shared/logistics/redux';
import { DateOnlyString } from '../../utils/date-types';

export function useAllTasks(date: moment.Moment) {
  const dispatch = useDispatch();
  const dateOnlyString = useMemo(() => {
    return date.format('YYYY-MM-DD') as DateOnlyString;
  }, [date]);

  const {
    data: courierUsers,
    isError: isErrorCourierUsers,
    isLoading: isLoadingCourierUsers,
    isFetching: isFetchingCourierUsers,
  } = useGetCourierUsersQuery();

  const {
    data: taskLists,
    isError: isErrorTaskLists,
    isFetching: isFetchingTaskLists,
    isLoading: isLoadingTaskLists,
    refetch: refetchTaskLists,
  } = useGetTaskListsV2Query(dateOnlyString);

  const {
    data: tasks,
    isError: isErrorTasks,
    isFetching: isFetchingTasks,
    isLoading: isLoadingTasks,
    refetch: refetchTasks,
  } = useGetTasksQuery(dateOnlyString);

  const {
    data: tours,
    isError: isErrorTours,
    isFetching: isFetchingTours,
    isLoading: isLoadingTours,
    refetch: refetchTours,
  } = useGetToursQuery(dateOnlyString);

  const isError = useMemo(() => {
    return (
      isErrorCourierUsers || isErrorTaskLists || isErrorTasks || isErrorTours
    );
  }, [isErrorCourierUsers, isErrorTaskLists, isErrorTasks, isErrorTours]);

  const isLoading = useMemo(() => {
    return (
      isLoadingCourierUsers ||
      isLoadingTaskLists ||
      isLoadingTasks ||
      isLoadingTours
    );
  }, [
    isLoadingCourierUsers,
    isLoadingTaskLists,
    isLoadingTasks,
    isLoadingTours,
  ]);

  const isFetching = useMemo(() => {
    return (
      isFetchingCourierUsers ||
      isFetchingTaskLists ||
      isFetchingTasks ||
      isFetchingTours
    );
  }, [
    isFetchingCourierUsers,
    isFetchingTaskLists,
    isFetchingTasks,
    isFetchingTours,
  ]);

  useEffect(() => {
    if (
      !isFetching &&
      !isError &&
      courierUsers &&
      taskLists &&
      tasks &&
      tours
    ) {
      dispatch(loadTaskListsSuccess(taskLists));
      dispatch(loadTasksSuccess(tasks));
      dispatch(loadToursSuccess(tours));
      dispatch(loadUsersSuccess(courierUsers));
    }
  }, [courierUsers, dispatch, isError, isFetching, taskLists, tasks, tours]);

  useEffect(() => {
    if (isError) {
      dispatch(loadTasksFailure());
      dispatch(loadTaskListsFailure());
      dispatch(loadToursFailure());
      dispatch(loadUsersFailure());
    }
  }, [dispatch, isError]);

  return {
    isError,
    isLoading,
    isFetching,
    refetch: () => {
      refetchTasks();
      refetchTaskLists();
      refetchTours();
      // Add refetchCourierUsers when needed..!
    },
  };
}
