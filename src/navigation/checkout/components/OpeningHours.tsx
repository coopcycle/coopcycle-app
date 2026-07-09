import React from 'react';

import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';

import classNames from 'classnames';
import { withTranslation } from 'react-i18next';
import { useColorScheme, View } from 'react-native';

const OpeningHours = props => {
  const colorScheme = useColorScheme();

  const background = colorScheme === 'dark' ? 'dark.300' : 'typography-white';
  const highlight = colorScheme === 'dark' ? 'typography-50' : 'typography-300';

  const weekdays = props.openingHoursSpecification.state.reduce(
    (acc, day, index) => {
      const hours = day.ranges.reduce((acc2, range, _index) => {
        acc2.push(
          <Text className="text-center px-3" key={`r${_index}`}>
            {range.join(' - ')}
          </Text>,
        );
        return acc2;
      }, []);
      acc.push(
        <HStack
          key={`h${index}`}
          className={classNames(
            'py-1',
            {[`bg-${highlight}`]: day.today},
            {[`bg-${background}`]: !day.today}
          )}
        >
          <Text
            className={classNames('text-center', { 'font-bold': day.today })}
            minW={'3em'}
            key={index}>
            {day.label}
          </Text>
          {hours}
        </HStack>,
      );
      return acc;
    },
    [],
  );

  return <View>{weekdays}</View>;
};

export default withTranslation()(OpeningHours);
