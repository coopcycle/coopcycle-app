import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import _ from 'lodash';
import { ChevronDownIcon } from '@/components/ui/icon';
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Text } from '@/components/ui/text';
import { useGetTaskFailureReasonsQuery } from '@/src/redux/api/slice';
import Task from '@/src/types/task';
import { FailureReason } from '@/src/redux/api/types';

type Props = {
  task: Task;
  selectedFailureReason?: string;
  onValueChange: (code: string, obj?: FailureReason) => void;
};

export const FailureReasonPicker = ({
  task,
  selectedFailureReason,
  onValueChange,
}: Props) => {
  const { t } = useTranslation();

  const { data, isSuccess, isError } = useGetTaskFailureReasonsQuery(
    task['@id'],
  );

  const values = useMemo(() => {
    if (!isSuccess) {
      return null;
    }
    return data['hydra:member'].map((value, index) => (
      <SelectItem
        key={index}
        value={value.code}
        label={value.description}
        testID={`failure-reason-option-${index}`}
      />
    ));
  }, [data, isSuccess]);

  const onChange = (selectedFailureReason: string) => {
    if (!isSuccess) {
      return;
    }
    const failureReasonObj = _.find(
      data['hydra:member'],
      r => r.code === selectedFailureReason,
    );
    onValueChange(selectedFailureReason, failureReasonObj);
  };

  if (isError) {
    return <Text color="red.500">Failure reasons are not available</Text>;
  }

  return (
    <Skeleton isLoaded={isSuccess} className="h-10 rounded">
      <Select
        testID="failure-reason-select"
        selectedValue={selectedFailureReason}
        onValueChange={v => onChange(v)}
      >
        <SelectTrigger
          variant="outline"
          size="md"
          className="justify-between"
          testID="failure-reason-select-trigger"
        >
          <SelectInput
            placeholder={t('SELECT_INCIDENT_TYPE')}
            value={
              selectedFailureReason
                ? data['hydra:member'].find(
                    r => r.code === selectedFailureReason,
                  )?.description || ''
                : ''
            }
            testID="failure-reason-select-input"
          />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            testID="failure-reason-select-backdrop"
          />
          <SelectContent testID="failure-reason-select-content">
            <SelectDragIndicatorWrapper testID="failure-reason-drag-indicator-wrapper">
              <SelectDragIndicator testID="failure-reason-drag-indicator" />
            </SelectDragIndicatorWrapper>
            <ScrollView
              style={{ maxHeight: 350 }}
              showsVerticalScrollIndicator={true}
              testID="failure-reason-options-scrollview"
            >
              <SelectItem
                label={`-- ${t('SELECT_FAILURE_REASON')} --`}
                value={null}
                testID="failure-reason-option-none"
              />
              {values}
            </ScrollView>
          </SelectContent>
        </SelectPortal>
      </Select>
    </Skeleton>
  );
};
