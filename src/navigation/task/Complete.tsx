import React from 'react';
import CompleteTab from '@/src/navigation/task/CompleteTab';
import { Formik } from 'formik';
import { CompleteTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch } from '@/src/redux/store';
import { markTaskDone, markTasksDone } from '@/src/redux/Courier';
import { useNavigateOnSuccess } from '@/src/navigation/task/hooks/useNavigateOnSuccess';

const initialValues = {
  notes: '',
  contactName: '',
} as CompleteTaskFormValues;

export default function Complete() {
  const route = useRoute();
  const dispatch = useAppDispatch();

  const task = route.params?.task;
  const tasks = route.params?.tasks;

  const navigateOnSuccess = useNavigateOnSuccess();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        if (tasks && tasks.length) {
          dispatch(
            markTasksDone(
              tasks,
              values.notes,
              navigateOnSuccess,
              values.contactName,
            ),
          );
        } else {
          dispatch(
            markTaskDone(
              task,
              values.notes,
              navigateOnSuccess,
              values.contactName,
            ),
          );
        }
      }}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
    >
      <CompleteTab task={task} tasks={tasks} success />
    </Formik>
  );
}
