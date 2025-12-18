import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
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
import { ChevronDownIcon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { TimeSlotChoice } from '@/src/redux/api/types';

type Props = {
  choices: TimeSlotChoice[];
  selectedChoice?: string;
  onChoiceChange: (choice: string) => void;
  testID?: string;
};

export function TimeSlotChoiceSelect({
  choices,
  selectedChoice,
  onChoiceChange,
  testID,
}: Props) {
  const { t } = useTranslation();

  const selectedItem = selectedChoice
    ? choices.find(c => c.value === selectedChoice)
    : undefined;

  useEffect(() => {
    if (selectedItem) return;

    // wait for choices to be loaded
    if (choices.length === 0) return;

    //TODO: when there are no choices => fix later (check that the choices are not being loaded right now)

    // Preselect the first available time slot choice when
    // 1. initial render: none is selected yet
    // 2. when the selected choice is not one of the available choices (e.g. when another time slot is selected)
    onChoiceChange(choices[0].value);
  }, [selectedItem, choices, selectedChoice, onChoiceChange]);

  if (!selectedItem) {
    return <Spinner />;
  }

  return (
    <Select
      selectedValue={selectedItem.value}
      initialLabel={selectedItem.label}
      onValueChange={onChoiceChange}
      testID={`${testID}-dropdown`}
    >
      <SelectTrigger variant="outline" size="md" testID={`${testID}-trigger`}>
        <SelectInput
          placeholder={t('STORE_NEW_DELIVERY_SELECT_TIME_SLOT')}
          testID={`${testID}-input`}
        />
        <SelectIcon
          className="mr-3"
          as={ChevronDownIcon}
          testID={`${testID}-icon`}
        />
      </SelectTrigger>
      <SelectPortal useRNModal>
        <SelectBackdrop
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          testID={`${testID}-backdrop`}
        />
        <SelectContent testID={`${testID}-content`}>
          <SelectDragIndicatorWrapper
            testID={`${testID}-drag-indicator-wrapper`}
          >
            <SelectDragIndicator testID={`${testID}-drag-indicator`} />
          </SelectDragIndicatorWrapper>
          <ScrollView
            style={{ maxHeight: 350 }}
            showsVerticalScrollIndicator={true}
            testID={`${testID}-options-scrollview`}
          >
            {choices &&
              choices.map((choice, index) => (
                <SelectItem
                  key={index}
                  value={choice.value}
                  label={choice.label}
                  testID={`${testID}-option-${choice.value}`}
                />
              ))}
          </ScrollView>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
