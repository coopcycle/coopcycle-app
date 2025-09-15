import React from 'react';
import { StyleSheet } from 'react-native';
import { whiteColor } from '../styles/common';
import { TaskTag } from '../types/task';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';

function TaskTagsList({ taskTags }: { taskTags: TaskTag[] }) {
  return (
    <Box>
      <HStack style={styles.tagsWrapper}>
        {taskTags.map((tag: TaskTag) => (
          <Text
            key={tag.slug}
            style={[
              styles.tag,
              {
                backgroundColor: tag.color,
              },
            ]}>
            {tag.name}
          </Text>
        ))}
      </HStack>
    </Box>
  );
}

const styles = StyleSheet.create({
  tagsWrapper: {
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 0,
    paddingHorizontal: 4,
    color: whiteColor,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
});

export default TaskTagsList;
