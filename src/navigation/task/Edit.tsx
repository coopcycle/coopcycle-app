import React from 'react';
import { View } from 'react-native';
import { Task, TaskStatus, TaskType } from '@/src/types/task';
import { VStack } from '@/components/ui/vstack';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (data: Partial<Task>) => void;
  isLoading?: boolean;
}

const taskStatusOptions: TaskStatus[] = ['TODO', 'DOING', 'DONE', 'FAILED'];
const taskTypeOptions: TaskType[] = ['PICKUP', 'DROPOFF'];

export const EditTask: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  isLoading = false,
}) => {
  return (
    <VStack space={4} style={{ padding: 4 }}>


      <Button
        onPress={onSubmit}
        isLoading={isLoading}
        isLoadingText="Saving"
      >
       <Text>{"Save Task"}</Text>
      </Button>
    </VStack>
  );
};