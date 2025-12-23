import React from 'react';
import CompleteTab from '@/src/navigation/task/CompleteTab';
import { Formik } from 'formik';
import { CompleteTaskFormValues } from '@/src/navigation/task/utils/taskFormHelpers';

const initialValues = {
  notes: '',
  contactName: '',
} as CompleteTaskFormValues;

export default function Complete() {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={() => {}}
      validateOnBlur={false}
      validateOnChange={false}
      enableReinitialize
    >
      <CompleteTab />
    </Formik>
  );
}
