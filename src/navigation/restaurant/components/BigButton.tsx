import { Icon, ArrowRightIcon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Heading } from '@/components/ui/heading';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import classNames from 'classnames';

export default ({ heading, text, onPress, danger }) => {

  return (
    <Pressable style={styles.btn} onPress={onPress}
      className={ classNames({ 'border-error-500': danger }) }>
      <HStack className="items-center justify-center">
        <View>
          <Heading
            className={ classNames({ 'text-error-500': danger }) }>{heading}</Heading>
          { text ? (<Text className={ classNames({ 'text-error-500': danger }) }>
            {text}
          </Text>) : null }
        </View>
        <Icon
          as={ArrowRightIcon}
          className={ classNames('ml-2', { 'text-error-500': danger }) }
          name="arrow-right"
        />
      </HStack>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    margin: 20,
    borderWidth: 1,
    borderRadius: 4,
    padding: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
