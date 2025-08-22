import React from 'react';
import { StyleSheet } from 'react-native';
import { whiteColor } from '../styles/common';
import { TaskTag } from '../types/task';
import { Box, HStack, Text } from './gluestack';

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
    gap: 2,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    color: whiteColor,
    borderRadius: 4,
    overflow: 'hidden',
    textTransform: 'capitalize',
  },
});

export default TaskTagsList;
