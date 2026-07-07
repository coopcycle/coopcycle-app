import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AttachmentItem } from './AttachmentItem';

const CONTENT_PADDING = 20;
const DELETE_ICON_SIZE = 32;

type Props = {
  signatures: string[];
  pictures: string[];
  onDeleteSignature: (index: number) => void;
  onDeletePicture: (index: number) => void;
};

// Memoized so the image grid doesn't re-render when the parent CompleteTab
// re-renders on every notes keystroke. Props are stable: the signature/picture
// arrays come straight from Redux selectors (same reference until they change),
// and the delete callbacks are memoized by the parent — so this whole subtree,
// including the decoded images, is skipped while typing.
export const Attachments = React.memo(function Attachments({
  signatures,
  pictures,
  onDeleteSignature,
  onDeletePicture,
}: Props) {
  return (
    <View style={styles.content}>
      <View style={styles.imagesContainer}>
        {signatures.map((uri, key) => (
          <AttachmentItem
            key={`signatures:${key}`}
            base64={uri}
            onPressDelete={() => onDeleteSignature(key)}
          />
        ))}
        {pictures.map((uri, key) => (
          <AttachmentItem
            key={`pictures:${key}`}
            base64={uri}
            onPressDelete={() => onDeletePicture(key)}
          />
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: CONTENT_PADDING + (CONTENT_PADDING - DELETE_ICON_SIZE / 2),
    paddingRight: CONTENT_PADDING + (CONTENT_PADDING - DELETE_ICON_SIZE / 2),
    paddingBottom: CONTENT_PADDING,
    paddingLeft: CONTENT_PADDING,
  },
  imagesContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});
