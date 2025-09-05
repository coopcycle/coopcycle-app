import React from 'react';
import { useTranslation } from 'react-i18next';
import { phonecall } from 'react-native-communications';
import { showLocation } from 'react-native-map-link';
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Box } from '@/components/ui/box';
import { Divider } from '@/components/ui/divider';
import { HStack } from '@/components/ui/hstack';
import { ChevronDownIcon, ChevronUpIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import IconText from '../../../components/IconText';
import TaskTagsList from '../../../components/TaskTagsList';
import TaskTypeIcon from '../../../components/TaskTypeIcon';
import { useBlackAndWhiteTextColor } from '../../../styles/gluestack-theme';
import { Task, TaskTag } from '../../../types/task';
import { getPackagesSummary, getTimeFrame } from '../../task/components/utils';
import { getTaskTitleForOrder } from '../utils';

interface PackageSummary {
  text: string;
  totalQuantity: number;
}
interface ContentProps {
  comments: string;
  timeframe: string;
  packageType: PackageSummary;
  tags: TaskTag[];
  streetAddress: string;
  onLocationPress: () => void;
  telephone: string;
  firstName: string | null;
  onPhonePress?: () => void;
}

const ContentText = ({
  comments,
  timeframe,
  packageType,
  tags,
  streetAddress,
  onLocationPress,
  telephone,
  firstName,
  onPhonePress,
}: ContentProps) => {
  const { t } = useTranslation();

  return (
    <Box style={{ gap: 12, width: '100%' }}>
      {tags && tags.length ? (
        <>
          <Divider />
          <TaskTagsList taskTags={tags} />
        </>
      ) : null}
      <Divider />
      <IconText
        label={t('ORDER_LOCATION')}
        iconName="map-marker-alt"
        text={streetAddress}
        onPress={onLocationPress}
      />
      <Divider />
      <IconText label={t('ORDER_SCHEDULE')} text={timeframe} iconName="clock" />
      {!!packageType.totalQuantity && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_PACKAGES')}
            text={`${t('TOTAL_AMOUNT')}: ${packageType.totalQuantity}\n${packageType.text}`}
            iconName="boxes"
          />
        </>
      )}
      {telephone && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_CLIENT')}
            text={`${firstName} - ${telephone}`}
            iconName="phone"
            onPress={onPhonePress}
          />
        </>
      )}
      {comments && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_COMMENTS')}
            text={comments}
            iconName="comments"
          />
        </>
      )}
    </Box>
  );
};
interface OrderAccordeonProps {
  task: Task;
}

function OrderAccordeon({ task }: OrderAccordeonProps) {
  const { t } = useTranslation();
  const taskTitle = getTaskTitleForOrder(task);
  const timeframe = getTimeFrame(task);
  const address = task.address.streetAddress;
  const packageType = getPackagesSummary(task);
  const comments = task.comments;
  const headerText = useBlackAndWhiteTextColor();

  // Function to handle location press
  const handleLocationPress = () => {
    showLocation({
      latitude: task.address.geo.latitude,
      longitude: task.address.geo.longitude,
      dialogTitle: t('OPEN_IN_MAPS_TITLE'),
      dialogMessage: t('OPEN_IN_MAPS_MESSAGE'),
      cancelText: t('CANCEL'),
    });
  };

  // Function to handle phone press
  const handlePhonePress = () => {
    if (task.address.telephone) {
      phonecall(task.address.telephone, true);
    }
  };

  return (
    <Accordion
      size="md"
      variant="filled"
      type="single"
      isCollapsible={true}
      isDisabled={false}
      className="border-outline-200 mb-2"
      style={{
        borderRadius: 24,
      }}>
      <AccordionItem value="a">
        <AccordionHeader>
          <AccordionTrigger>
            {({ isExpanded }) => {
              return (
                <>
                  <Box className="flex-1 flex-col">
                    <HStack space="xs" className="mb-2">
                      <TaskTypeIcon colored task={task} />
                      <AccordionTitleText
                        style={{
                          lineHeight: 22,
                          textTransform: 'uppercase',
                          color: headerText,
                          marginLeft: 12,
                        }}>
                        {taskTitle}
                      </AccordionTitleText>
                    </HStack>
                    <HStack space="md" style={{ alignItems: 'center' }}>
                      <Text bold style={{ color: headerText }}>
                        {timeframe}
                      </Text>
                      <Divider orientation="vertical" className="h-8" />
                      <Text bold style={{ color: headerText, flexShrink: 1 }}>
                        {address}
                      </Text>
                    </HStack>
                  </Box>
                  {isExpanded ? (
                    <AccordionIcon as={ChevronUpIcon} className="ml-3" />
                  ) : (
                    <AccordionIcon as={ChevronDownIcon} className="ml-3" />
                  )}
                </>
              );
            }}
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent>
          <Box className="w-full">
            <AccordionContentText />
          </Box>

          <ContentText
            timeframe={timeframe}
            packageType={packageType}
            tags={task.tags}
            streetAddress={address}
            onLocationPress={handleLocationPress}
            telephone={task.address.telephone}
            firstName={task.address.firstName}
            comments={comments}
            onPhonePress={handlePhonePress}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default OrderAccordeon;
