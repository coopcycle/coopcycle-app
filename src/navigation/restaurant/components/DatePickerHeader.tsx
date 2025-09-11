import { Icon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Calendar, RefreshCw, ChevronRight } from 'lucide-react-native';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';

class DatePickerHeader extends Component {
  render() {
    const { width } = Dimensions.get('window');
    const { date } = this.props;

    let dateFormat = 'L';
    if (width > 400) {
      dateFormat = 'dddd LL';
    }

    return (
      <HStack className="w-full">
        <Pressable className="w-1/2" onPress={() => this.props.onCalendarClick()}>
          <HStack
            className="items-center justify-between p-2">
            <Icon as={Calendar} />
            <Text>{date.format(dateFormat)}</Text>
            <Icon
              as={ChevronRight}
              style={{ color: '#ddd' }}
            />
          </HStack>
        </Pressable>
        <Pressable className="w-1/2" onPress={() => this.props.onTodayClick()}>
          <HStack
            className="items-center justify-between p-2 bg-success-200">
            <Icon as={RefreshCw} />
            <Text>{this.props.t('TODAY')}</Text>
          </HStack>
        </Pressable>
      </HStack>
    );
  }
}

export default withTranslation()(DatePickerHeader);
