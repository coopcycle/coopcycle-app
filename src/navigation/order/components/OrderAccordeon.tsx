import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Divider,
  Text,
} from '../../../components/gluestack';
import IconText from '../../../components/IconText';
import TaskTagsList from '../../../components/TaskTagsList';
import TaskTypeIcon from '../../../components/TaskTypeIcon';
import { getTaskTitle } from '../../../shared/src/utils';
import { blackColor, greyColor, whiteColor } from '../../../styles/common';
import { Task } from '../../../types/task';
import { getPackagesSummary, getTimeFrame } from '../../task/components/utils';
import { useTranslation } from 'react-i18next';

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
  return (
    <Box
      sx={{
        marginBottom: 16,
      }}>
      <Accordion
        size="md"
        variant="filled"
        type="single"
        isCollapsible={true}
        isDisabled={false}
        sx={{
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: whiteColor,
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
            sx={{
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: whiteColor,
            }}>
            <AccordionTrigger
              sx={{
                paddingHorizontal: 16,
                paddingVertical: 12,
              }}>
              {({ isExpanded }) => {
                return (
                  <>
                    <AccordionTitleText
                      sx={{
                        marginEnd: 4,
                      }}>
                      <Box
                        sx={{
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
                            color: blackColor,
                          }}
                          bold>
                          {taskTitle}
                        </Text>
                      </Box>
                      <Box
                        sx={{
                          flexDirection: 'row',
                          gap: 8,
                          alignItems: 'center',
                        }}>
                        <Box>
                          <Text bold style={{ color: blackColor }}>
                            {timeframe}
                          </Text>
                        </Box>
                        <Box
                          sx={{
                            borderStartWidth: 1,
                            borderStartColor: greyColor,
                            paddingStart: 8,
                            flex: 1,
                          }}>
                          <Text bold style={{ color: blackColor }}>
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
            sx={{
              paddingHorizontal: 16,
            }}>
            <AccordionContentText>
              <Box sx={{ gap: 12, width: '100%' }}>
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
