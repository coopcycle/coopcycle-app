import React from 'react';
import CompleteTab from '@/src/navigation/task/CompleteTab';
import { Formik } from 'formik';
import { CompleteTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';
import { useRoute } from '@react-navigation/native';
import { useAppDispatch } from '@/src/redux/store';
import { markTaskDone, markTasksDone } from '@/src/redux/Courier';
import { useNavigateOnSuccess } from '@/src/navigation/task/hooks/useNavigateOnSuccess';
import { showAlert } from '@/src/utils/alert';

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
        // The promise is returned so Formik clears `isSubmitting` once the
        // request settles. That flag is what tells the courier the tap was
        // registered, and without it the button stayed disabled for good —
        // including when the request failed, or when the files were too big
        // and the thunk bailed out before sending anything.
        //
        // The thunks handle their own request errors; the catch is for
        // anything unexpected on the way there. Formik leaves `isSubmitting`
        // set on a rejected promise, so without it the button dies silently.
        const submit =
          tasks && tasks.length
            ? markTasksDone(
                tasks,
                values.notes,
                navigateOnSuccess,
                values.contactName,
              )
            : markTaskDone(
                task,
                values.notes,
                navigateOnSuccess,
                values.contactName,
              );

        return dispatch(submit).catch(e => {
          console.error('Task completion failed:', e);
          showAlert(e);
        });
      }}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
    >
      <CompleteTab task={task} tasks={tasks} success />
    </Formik>
  );
}
