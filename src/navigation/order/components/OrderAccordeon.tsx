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
import { useBaseTextColor } from '../../../styles/theme';
import { Task, TaskTag } from '../../../types/task';
import { addDayIfNotToday, getPackagesSummary, getTimeFrame } from '../../task/components/utils';
import { getStatusBackgroundColor, getTaskTitleForOrder } from '../utils';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import FAIcon from '@/src/components/Icon';
import { navigateToCompleteTask } from '../../utils';

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
  status?: string;
  hasIncidents?: boolean;
  onReportIncident?: () => void;
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
  status,
  hasIncidents,
  onReportIncident
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
      {!!telephone && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_CLIENT')}
            text={firstName ? `${firstName} - ${telephone}` : `${telephone}`}
            iconName="phone"
            onPress={onPhonePress}
          />
        </>
      )}
      {!!comments && (
        <>
          <Divider />
          <IconText
            label={t('ORDER_COMMENTS')}
            text={comments}
            iconName="comments"
          />
        </>
      )}
      {!hasIncidents && status !== 'DONE' && status !== 'CANCELLED' && (
        <>
          <Divider />
          <TouchableOpacity
            onPress={onReportIncident}
            style={styles.incidentButton}
          >
            <FAIcon name="exclamation-triangle" />
            <Text style={styles.incidentButtonText}>
              {t('REPORT_INCIDENT')}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Box>
  );
};

interface OrderAccordeonProps {
  task: Task;
  navigation: NavigationProp<object>;
  route: object;
}

function OrderAccordeon({ task, navigation, route }: OrderAccordeonProps) {
  const { t } = useTranslation();
  const taskTitle = getTaskTitleForOrder(task);
  const address = task.address.streetAddress;
  const packageType = getPackagesSummary(task);
  const comments = task.comments;
  const headerText = useBaseTextColor();

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

  // Function to handle report incident
  const handleReportIncident = () => {
    navigateToCompleteTask(navigation, route, task, [], false);
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
                    <HStack space="xs" className="mb-2" style={{ alignItems: 'center' }}>
                      <TaskTypeIcon colored task={task} />
                      <AccordionTitleText
                        style={{
                          textTransform: 'uppercase',
                          color: headerText,
                          marginLeft: 6,
                        }}
                      >
                        {taskTitle || (task.type === 'PICKUP' ? t('PICKUP') : t('DROPOFF'))}
                      </AccordionTitleText>
                      <View>
                        {task.hasIncidents ?
                          (
                            <View style={{ backgroundColor: "#facc15", borderRadius: 12, paddingHorizontal: 6, alignSelf: 'flex-start', marginTop: 4 }}>
                              <Text style={{  fontSize: 11, fontWeight: '600', color: '#000' }}>
                                {t('INCIDENT').toUpperCase()}
                              </Text>
                            </View>
                          ) : (
                            <View style={{ backgroundColor: getStatusBackgroundColor(task.status), borderRadius: 12 }} className="px-2 mt-1 self-start">
                              <Text style={{ fontSize: 11, fontWeight: '600', color: '#000' }}>
                                {task.status}
                              </Text>
                            </View>
                          )
                        }
                      </View>
                    </HStack>
                    <HStack space="md" style={{ alignItems: 'center' }}>
                      <Text bold style={{ color: headerText }}>
                        {getTaskTimeFrame(task, "\n")}
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
            timeframe={getTaskTimeFrame(task, " ")}
            packageType={packageType}
            tags={task.tags}
            streetAddress={address}
            onLocationPress={handleLocationPress}
            telephone={task.address.telephone}
            firstName={task.address.firstName}
            comments={comments}
            onPhonePress={handlePhonePress}
            status={task.status}
            hasIncidents={task.hasIncidents}
            onReportIncident={handleReportIncident}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function getTaskTimeFrame(task: Task, separator: string) {
  return (
    addDayIfNotToday(task.doneAfter, separator) +
    getTimeFrame(task)
  );
}

export default OrderAccordeon;
const styles = StyleSheet.create({
  incidentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    paddingVertical: 4,
  },
});
