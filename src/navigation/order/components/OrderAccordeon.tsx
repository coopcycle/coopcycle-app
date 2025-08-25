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
import { greyColor, whiteColor } from '../../../styles/common';
import { Task } from '../../../types/task';
import { getPackagesSummary, getTimeFrame } from '../../task/components/utils';

interface OrderAccordeonProps {
  task: Task;
}

function OrderAccordeon({ task }: OrderAccordeonProps) {
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
                          alignItems: 'baseline',
                        }}>
                        <TaskTypeIcon task={task} />
                        <Text size="2xl" style={{ lineHeight: 22 }} bold>
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
                          <Text bold>{timeframe}</Text>
                        </Box>
                        <Box
                          sx={{
                            borderStartWidth: 1,
                            borderStartColor: greyColor,
                            paddingStart: 8,
                            flex: 1,
                          }}>
                          <Text bold>{address}</Text>
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
                  iconName="map-marker-alt"
                  text={task.address.streetAddress}
                />
                <Divider />
                <IconText text={timeframe} iconName="clock" />
                <Divider />
                <IconText text={packageType.text} iconName="box" />

                {task.address.telephone && (
                  <>
                    <Divider />
                    <IconText
                      text={`${task.address.firstName} - ${task.address.telephone}`}
                      iconName="phone"
                    />
                  </>
                )}
                {comments && (
                  <>
                    <Divider />
                    <IconText text={comments} iconName="comments" />
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
