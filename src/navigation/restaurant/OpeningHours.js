import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Box, HStack, Heading, Icon, Pressable, Text } from 'native-base';
import _ from 'lodash';
import moment from 'moment';

import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { deleteOpeningHoursSpecification } from '../../redux/Restaurant/actions';
import { selectSpecialOpeningHoursSpecification } from '../../redux/Restaurant/selectors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ItemSeparator from '../../components/ItemSeparator';

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
        <Heading size="md" p="3">
          {this.props.t('RESTAURANT_OPENING_HOURS')}
        </Heading>
        <FlatList
          data={data}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item, index) => `ohs-${index}`}
          renderItem={({ item, index }) => (
            <Box p="3">
              <Text>{item.text}</Text>
            </Box>
          )}
        />
      </Box>
    );
  }

  renderSpecialOpeningHours() {
    const { specialOpeningHoursSpecification, httpClient } = this.props;

    return (
      <Box>
        <Heading size="md" p="3">
          {this.props.t('RESTAURANT_SPECIAL_OPENING_HOURS')}
        </Heading>
        <FlatList
          data={specialOpeningHoursSpecification}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={(item, index) => `sohs-${index}`}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() =>
                this.props.deleteOpeningHoursSpecification(httpClient, item)
              }>
              <HStack p="3" justifyContent="space-between" alignItems="center">
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
                <Icon as={FontAwesome} name="close" />
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
    httpClient: state.app.httpClient,
    openingHoursSpecification: restaurant.openingHoursSpecification,
    restaurant,
    specialOpeningHoursSpecification:
      selectSpecialOpeningHoursSpecification(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteOpeningHoursSpecification: (httpClient, openingHoursSpecification) =>
      dispatch(
        deleteOpeningHoursSpecification(httpClient, openingHoursSpecification),
      ),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withTranslation()(OpeningHoursScreen));
