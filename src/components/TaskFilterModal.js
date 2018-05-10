import React from 'react'
import { Modal, View, StyleSheet } from 'react-native'
import {
  Container, Header, Button, Icon, Left, Right,
  Body, Title, Content, Grid, Row, Col, Text, CheckBox
} from 'native-base'
import { translate } from 'react-i18next'
import { whiteColor } from '../styles/common'


const style = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: whiteColor
}


const TaskFilterModal = ({
    isVisible,
    onRequestClose,
    areDoneTasksHidden,
    areFailedTasksHidden,
    toggleDisplayDone,
    toggleDisplayFailed,
    toggleDisplayTag,
    isTagHidden,
    tags,
    t,
  }) => (
  <Modal
    animationType='slide'
    transparent={true}
    visible={isVisible}
    onRequestClose={onRequestClose}
  >
    <View style={style}>
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={onRequestClose}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>{t('TASKS_FILTER')}</Title>
          </Body>
          <Right />
        </Header>
        <Content style={{ marginTop: 20 }}>
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
    </View>
  </Modal>
)

TaskFilterModal.defaultProps = {
  tags: [],
}

export default translate()(TaskFilterModal)
