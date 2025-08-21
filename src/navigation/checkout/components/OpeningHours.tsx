import React from 'react';

import { HStack, Text, View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';

const OpeningHours = props => {
  const colorScheme = useColorScheme();

  const background = colorScheme === 'dark' ? 'dark.300' : 'white';
  const highlight = colorScheme === 'dark' ? 'dark.50' : 'blueGray.300';

  const weekdays = props.openingHoursSpecification.state.reduce(
    (acc, day, index) => {
      const hours = day.ranges.reduce((acc2, range, _index) => {
        acc2.push(
          <Text textAlign={'center'} key={`r${_index}`} paddingX={3}>
            {range.join(' - ')}
          </Text>,
        );
        return acc2;
      }, []);
      acc.push(
        <HStack
          paddingY={1}
          key={`h${index}`}
          backgroundColor={day.today ? highlight : background}>
          <Text textAlign={'center'} minW={'3em'} key={index} bold={day.today}>
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
