import React from 'react'
import { View } from 'react-native'
import {
  Container, Header, Button, Icon, Left, Right,
  Body, Title, Content, Grid, Row, Col, Text, CheckBox
} from 'native-base'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import {
  filterTasks,
  clearTasksFilter,
  selectIsTagHidden,
  selectFilteredTasks,
  selectIsTasksLoading,
  selectIsTasksLoadingFailure,
  selectTaskSelectedDate,
  selectAreDoneTasksHidden,
  selectAreFailedTasksHidden,
  selectTagNames,
} from '../../redux/Courier'

const Filters = ({
    areDoneTasksHidden,
    areFailedTasksHidden,
    toggleDisplayDone,
    toggleDisplayFailed,
    toggleDisplayTag,
    isTagHidden,
    tags,
    t,
  }) => (
    <Container>
      <Content padder>
        <Grid>
          <Row style={{ marginLeft: 20, marginBottom: 10 }}>
            <Col>
              <Text>{t('HIDE_DONE_TASKS')}:</Text>
            </Col>
            <Col>
              <CheckBox onPress={() => toggleDisplayDone(areDoneTasksHidden)} checked={areDoneTasksHidden} />
            </Col>
          </Row>
          <Row style={{ marginLeft: 20, marginBottom: 10 }}>
            <Col>
              <Text>{t('HIDE_FAILED_TASKS')}:</Text>
            </Col>
            <Col>
              <CheckBox onPress={() => toggleDisplayFailed(areFailedTasksHidden)} checked={areFailedTasksHidden} />
            </Col>
          </Row>
          <Row style={{ marginLeft: 20, marginBottom: 10 }}>
            <Col>
              <Text>{t('HIDE_TASKS_FAILED_WITH')}</Text>
            </Col>
          </Row>
          {
            tags.map(tag => (
              <Row style={{ marginLeft: 20, marginBottom: 10 }} key={tag}>
                <Col>
                  <Text>{tag}</Text>
                </Col>
                <Col>
                  <CheckBox onPress={() => toggleDisplayTag(tag, isTagHidden(tag))} checked={isTagHidden(tag)} />
                </Col>
              </Row>
            ))
          }
        </Grid>
      </Content>
    </Container>
)

function mapStateToProps(state) {
  return {
    tags: selectTagNames(state),
    areDoneTasksHidden: selectAreDoneTasksHidden(state),
    areFailedTasksHidden: selectAreFailedTasksHidden(state),
    isTagHidden: selectIsTagHidden(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDisplayDone: (hidden) => dispatch(hidden ? clearTasksFilter({ status: 'DONE' }) : filterTasks({ status: 'DONE' })),
    toggleDisplayFailed: (hidden) => dispatch(hidden ? clearTasksFilter({ status: 'FAILED' }) : filterTasks({ status: 'FAILED' })),
    toggleDisplayTag: (tag, hidden) => dispatch(hidden ? clearTasksFilter({ tags: tag }) : filterTasks({ tags: tag })),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(Filters))
