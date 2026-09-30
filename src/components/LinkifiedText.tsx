import React, { useMemo } from 'react';
import { Text } from '@/components/ui/text';
import { parseLinks } from '../utils/linkify';
import { openUrl } from '../utils/url';

type Props = React.ComponentProps<typeof Text> & {
  children?: string | null;
};

/**
 * Renders a text, turning urls, email addresses & phone numbers into
 * tappable links.
 */
const LinkifiedText = ({ children, className, ...props }: Props) => {
  const parts = useMemo(() => parseLinks(children || ''), [children]);

  return (
    <Text {...props} className={className}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return part.value;
        }

        return (
          <Text
            key={`link-${index}`}
            {...props}
            className={[className, 'text-info-600 underline']
              .filter(Boolean)
              .join(' ')}
            accessibilityRole="link"
            testID={`linkified-${part.kind}`}
            onPress={() => {
              openUrl(part.url);
            }}
          >
            {part.value}
          </Text>
        );
      })}
    </Text>
  );
};

export default LinkifiedText;
