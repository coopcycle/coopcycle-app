import React from 'react';
import { useTranslation } from 'react-i18next';
import IconText from '../../../components/IconText';
import TaskTagsList from '../../../components/TaskTagsList';
import TaskTypeIcon from '../../../components/TaskTypeIcon';
import { getTaskTitle } from '../../../shared/src/utils';
import { useBlackAndWhiteTextColor } from '../../../styles/gluestack-theme';
import { Task } from '../../../types/task';
import { getPackagesSummary, getTimeFrame } from '../../task/components/utils';
// TODO CHANGE
import { ChevronDownIcon, ChevronUpIcon } from 'native-base/src/index';
import { Box } from '../../../../components/ui/box';
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '../../../../components/ui/accordion';
import { Text } from '../../../../components/ui/text';
import { Divider } from '../../../../components/ui/divider';

interface OrderAccordeonProps {
  task: Task;
}

function OrderAccordeon({ task }: OrderAccordeonProps) {
  const { t } = useTranslation();
  const taskTitle = getTaskTitle(task);
  const timeframe = getTimeFrame(task);
  const address: string = task.address.streetAddress;
  const packageType = getPackagesSummary(task);
  const comments: string = task.comments;
  const headerText = useBlackAndWhiteTextColor();
  return (
    <Box
      style={{
        marginBottom: 16,
      }}>
      <Accordion
        size="md"
        variant="unfilled"
        type="single"
        isCollapsible={true}
        isDisabled={false}
        style={{
          borderRadius: 12,
          overflow: 'hidden',
          shadowColor: '$shadowColor',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4, // for Android
        }}>
        <AccordionItem value="a">
          <AccordionHeader
            style={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}>
            <AccordionTrigger
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText
                      style={{
                        marginEnd: 4,
                      }}>
                      <Box
                        style={{
                          gap: 10,
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                        }}>
                        <TaskTypeIcon colored task={task} />
                        <Text
                          size="lg"
                          style={{
                            lineHeight: 22,
                            textTransform: 'uppercase',
                            color: headerText,
                          }}
                          bold>
                          {taskTitle}
                        </Text>
                      </Box>
                      <Box
                        style={{
                          flexDirection: 'row',
                          gap: 8,
                          alignItems: 'center',
                        }}>
                        <Box>
                          <Text bold style={{ color: headerText }}>
                            {timeframe}
                          </Text>
                        </Box>
                        <Box
                          style={{
                            borderStartWidth: 1,
                            borderStartColor: headerText,
                            paddingStart: 8,
                            flex: 1,
                          }}>
                          <Text bold style={{ color: headerText }}>
                            {address}
                          </Text>
                        </Box>
                      </Box>
                    </AccordionTitleText>
                    {isExpanded ? (
                      <AccordionIcon as={ChevronUpIcon} />
                    ) : (
                      <AccordionIcon as={ChevronDownIcon} />
                    )}
                  </>
                );
              }}
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionContent
            style={{
              paddingHorizontal: 16,
            }}>
            <AccordionContentText>
              <Box style={{ gap: 12, width: '100%' }}>
                {task.tags && task.tags.length ? (
                  <>
                    <Divider />
                    <TaskTagsList taskTags={task.tags} />
                  </>
                ) : null}
                <Divider />
                <IconText
                  label={t('ORDER_LOCATION')}
                  iconName="map-marker-alt"
                  text={task.address.streetAddress}
                />
                <Divider />
                <IconText
                  label={t('ORDER_SCHEDULE')}
                  text={timeframe}
                  iconName="clock"
                />
                <Divider />
                <IconText
                  label={t('ORDER_PACKAGES')}
                  text={packageType.text}
                  iconName="box"
                />

                {task.address.telephone && (
                  <>
                    <Divider />
                    <IconText
                      label={t('ORDER_CLIENT')}
                      text={`${task.address.firstName} - ${task.address.telephone}`}
                      iconName="phone"
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
            </AccordionContentText>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}

export default OrderAccordeon;
