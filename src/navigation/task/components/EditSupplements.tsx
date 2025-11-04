import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import i18n from '@/src/i18n';
import { EditFormSelect } from './EditFormSelect';
import { StyleSheet } from 'react-native';
import { Counter } from './Counter';
import { useState } from 'react';

const styles = StyleSheet.create({
  counterButton: {
    padding: 0,
    backgroundColor: '#C6C7C7'
  }
})

export const EditSupplements = ({ task }) => {
  const t = i18n.t;
  const [supplements, setSupplements] = useState([]);

  return (
    <>
      {supplements.map(s => {
        return (
          <HStack>
            {supplements && (
              <Counter item={s}/>
            )}
          </HStack>
        );
      })}
      <EditFormSelect
        handler={() => {}}
        defaultValue="Supplements"
        values={['1','2']}
      />
    </>
  );
};
