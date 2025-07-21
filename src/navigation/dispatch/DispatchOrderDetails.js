import { HStack, Text } from 'native-base';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectTasksEntities } from '../../shared/logistics/redux';

const DispatchOrderDetails = ({route}) => {
  const allTasksEntities = useSelector(selectTasksEntities)

  const orderID = route.params.orderID
  return (
    <HStack alignItems="center" justifyContent="center" p="2">
      <Text>{orderID}</Text>
    </HStack>
  );
};

export default DispatchOrderDetails;
