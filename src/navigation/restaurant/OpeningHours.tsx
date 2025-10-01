import _ from 'lodash';
import moment from 'moment';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Pressable } from '@/components/ui/pressable';
import { Heading } from '@/components/ui/heading';
import React, { Component } from 'react';
import { FlatList } from 'react-native';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import ItemSeparator from '../../components/ItemSeparator';
import { deleteOpeningHoursSpecification } from '../../redux/Restaurant/actions';
import { selectSpecialOpeningHoursSpecification } from '../../redux/Restaurant/selectors';
import { selectHttpClient } from '../../redux/App/selectors';

class OpeningHoursScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderOpeningHours() {
    const { openingHoursSpecification } = this.props;

    const data = openingHoursSpecification.map(ohs => {
      let text = '';

      const baseParams = {
        opens: moment(ohs.opens, 'HH:mm').format('LT'),
        closes: moment(ohs.closes, 'HH:mm').format('LT'),
      };

      if (ohs.dayOfWeek.length === 1) {
        text = this.props.t('RESTAURANT_OPENING_HOURS_ONE_DAY', {
          ...baseParams,
          day: moment().isoWeekday(ohs.dayOfWeek[0]).format('dddd'),
        });
      } else {
        text = this.props.t('RESTAURANT_OPENING_HOURS_DAY_RANGE', {
          ...baseParams,
          firstDay: moment().isoWeekday(_.first(ohs.dayOfWeek)).format('dddd'),
          lastDay: moment().isoWeekday(_.last(ohs.dayOfWeek)).format('dddd'),
        });
      }

      return {
        ohs,
        text,
      };
    });

    return (
      <Box>
        <Heading size="md" className="p-3">
          {this.props.t('RESTAURANT_OPENING_HOURS')}
        </Heading>
        <FlatList
          data={data}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item, index) => `ohs-${index}`}
          renderItem={({ item, index }) => (
            <Box className="p-3">
              <Text>{item.text}</Text>
            </Box>
          )}
        />
      </Box>
    );
  }

  renderSpecialOpeningHours() {
    const { specialOpeningHoursSpecification } = this.props;

    return (
      <Box>
        <Heading size="md" className="p-3">
          {this.props.t('RESTAURANT_SPECIAL_OPENING_HOURS')}
        </Heading>
        <FlatList
          data={specialOpeningHoursSpecification}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item, index) => `sohs-${index}`}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => this.props.deleteOpeningHoursSpecification(item)}>
              <HStack className="p-3 justify-between items-center">
                <Text>
                  {this.props.t('RESTAURANT_OPENING_HOURS_VALID_FROM_THROUGH', {
                    validFrom: moment(item.validFrom, 'YYYY-MM-DD').format(
                      'll',
                    ),
                    validThrough: moment(
                      item.validThrough,
                      'YYYY-MM-DD',
                    ).format('ll'),
                  })}
                </Text>
                <Icon as={CloseIcon} size="xl" />
              </HStack>
            </Pressable>
          )}
        />
      </Box>
    );
  }

  render() {
    return (
      <Box>
        {this.renderOpeningHours()}
        {this.renderSpecialOpeningHours()}
      </Box>
    );
  }
}

function mapStateToProps(state) {
  const { restaurant } = state.restaurant;

  return {
    httpClient: selectHttpClient(state),
    openingHoursSpecification: restaurant.openingHoursSpecification,
    restaurant,
    specialOpeningHoursSpecification:
      selectSpecialOpeningHoursSpecification(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteOpeningHoursSpecification: openingHoursSpecification =>
      dispatch(deleteOpeningHoursSpecification(openingHoursSpecification)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(OpeningHoursScreen));
