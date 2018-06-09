import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import { Container, Content, Footer, FooterTab, Text, Button, Icon, Header, Title, Left, Body, Right, Form, Item, Input, Label } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import MapView from 'react-native-maps'
import Swipeout from 'react-native-swipeout'
import moment from 'moment/min/moment-with-locales'
import { translate } from 'react-i18next'
import { localeDetector } from '../../i18n'
import { phonecall } from 'react-native-communications'

import { greenColor, greyColor, redColor } from "../../styles/common"
import { selectIsTasksLoading, selectTasksList, markTaskDone, markTaskFailed } from "../../redux/Courier"

moment.locale(localeDetector())

const isCompleted = task => task.status !== 'TODO'

class TaskPage extends Component {

  map = null

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      modalContextValid: true,
      swipeOutClose: false,
      notes: ''
    }
  }

  componentWillReceiveProps(nextProps) {

    const { task } = this.props.navigation.state.params

    // HACK : check if the task status has been updated - if yes go back to tasklist page
    // I think the way to do it properly would be to integrate react-navigation in redux but it does seem a lot of work

    let previousTask = _.find(this.props.tasks, (taskA) => taskA['@id'] === task['@id']),
      currentTask = _.find(nextProps.tasks, (taskA) => taskA['@id'] === task['@id'])

    if (!currentTask || previousTask.status !== currentTask.status) {
      this.props.navigation.goBack()
    }
  }

  markTaskDone() {

    const { task } = this.props.navigation.state.params
    const { markTaskDone } = this.props
    const { notes } = this.state

    markTaskDone(this.props.httpClient, task, notes)
  }

  markTaskFailed() {

    const { task } = this.props.navigation.state.params
    const { markTaskFailed } = this.props
    const { notes } = this.state

    markTaskFailed(this.props.httpClient, task, notes)

  }

  onMapReady() {

    const { geolocation, task } = this.props.navigation.state.params

    const coordinates = [
      geolocation,
      {
        latitude: task.address.geo.latitude,
        longitude: task.address.geo.longitude,
      }
    ]

    this.map.fitToCoordinates(_.filter(coordinates), {
      edgePadding: {
        top: 50,
        left: 50,
        bottom: 50,
        right: 50
      },
      animated: true
    })
  }

  renderTaskDetails() {

    const { navigate } = this.props.navigation
    const { task } = this.props.navigation.state.params

    const timeframe = moment(task.doneAfter).format('LT') + ' - ' + moment(task.doneBefore).format('LT')
    let address = task.address.name ? [ task.address.name, task.address.streetAddress ].join(' - ') : task.address.streetAddress
    const name = [ task.address.firstName, task.address.lastName ].filter(function (item) {return item}).join(' ')
    address = name ? [ name, address ].join(' - ') : address
    const events = _.sortBy(task.events, [ event => moment(event.createdAt) ])
    const lastEvent = _.last(events)

    const items = [
      {
        iconName: 'md-navigate',
        text: address
      },
      {
        iconName: 'md-clock',
        text: timeframe
      }
    ]

    if (task.comments) {
      items.push({
        iconName: 'chatbubbles',
        text: task.comments
      })
    }

    if (task.address.description || task.address.floor) {
      const floor = task.address.floor ? [ this.props.t('FLOOR'), task.address.floor ].join(' : ') : null
      const description = [ floor, task.address.description ].filter(function (item) {return item}).join(' - ')

      items.push({
        iconName: 'information-circle',
        text: description
      })
    }

    if (task.tags.length > 0) {
      items.push({
        iconName: 'star',
        component: (
          <View style={{ flex: 1, flexDirection: 'row' }}>
          { task.tags.map(tag => (
            <Button style={{ backgroundColor: tag.color, marginRight: 5 }} key={ tag.slug } small disabled>
              <Text style={{ fontSize: 10 }}>{ tag.slug }</Text>
            </Button>
          )) }
          </View>
        )
      })
    }

    if (task.address.telephone) {
      items.push({
        iconName: 'call',
        text: task.address.telephone,
        onPress: () => phonecall(task.address.telephone, true)
      })
    }

    items.push({
      iconName: 'calendar',
      text: this.props.t('LAST_TASK_EVENT', { fromNow: moment(lastEvent.createdAt).fromNow() }),
      onPress: () => navigate('CourierTaskHistory', { task })
    })

    return (
      <FlatList
        data={ items }
        keyExtractor={ (item, index) => item.iconName }
        renderItem={ ({ item }) => this.renderTaskDetail(item) }
        ItemSeparatorComponent={ () => (
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: "#ccc",
            }}
          />
        )} />
    )
  }

  pinColor(task) {
    let color = greyColor

    if (task.tags.length > 0) {
      color = task.tags[0].color
    }

    return color
  }

  renderTaskDetail(item) {

    const { iconName, text, component, onPress } = item

    let touchableOpacityProps = {}
    if (onPress) {
      touchableOpacityProps = { onPress }
    }

    const body = (
      <Col size={ onPress ? 7 : 8 }>
        { text && <Text style={ styles.taskDetailText }>{ text }</Text> }
        { component && component }
      </Col>
    )

    return (
      <TouchableOpacity style={{ flex:  1 }} { ...touchableOpacityProps }>
        <Row style={ styles.row }>
          <Col size={ 2 } style={ styles.iconContainer }>
            <Icon name={ iconName } style={{ color: '#ccc' }} />
          </Col>
          { body }
          { onPress &&
          <Col size={ 1 }>
            <Icon name="arrow-forward" style={{ color: '#ccc' }} />
          </Col> }
        </Row>
      </TouchableOpacity>
    )
  }

  renderLoader() {
    const { isLoadingTasks } = this.props

    if (isLoadingTasks) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{ isLoadingTasks }</Text>
        </View>
      );
    }

    return (
      <View />
    )
  }

  renderModal() {

    const { modalContextValid  } = this.state

    const buttonIconName = modalContextValid ? 'checkmark' : 'warning'
    const onPress = modalContextValid ? this.markTaskDone.bind(this) : this.markTaskFailed.bind(this)

    return (
      <Modal
        animationType={ 'slide' }
        transparent={ true }
        visible={ this.state.modalVisible }
        onRequestClose={ () => this.setState({ modalVisible: false }) }>
        <View style={ styles.modalWrapper }>
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={ () => this.setState({ modalVisible: false }) }>
                  <Title style={{ fontSize: 14 }}>{this.props.t('CANCEL')}</Title>
                </Button>
              </Left>
              <Body />
              <Right />
            </Header>
            <Content>
              <Grid>
                <Row style={{ paddingVertical: 30, paddingHorizontal: 10 }}>
                  <Col>
                    <Form>
                      <Item stackedLabel>
                        <Label>{this.props.t('NOTES')}</Label>
                        <Input onChangeText={ text => this.setState({ notes: text }) } />
                      </Item>
                    </Form>
                  </Col>
                </Row>
              </Grid>
            </Content>
            <Footer style={{ alignItems: 'center', backgroundColor: modalContextValid ? greenColor : redColor }}>
              <TouchableOpacity style={ styles.buttonContainer } onPress={ onPress }>
                <View style={ styles.buttonTextContainer }>
                  <Icon name={ buttonIconName } style={{ color: '#fff', marginRight: 10 }} />
                  <Text style={{ color: '#fff' }}>{ modalContextValid ? this.props.t('VALIDATE') : this.props.t('MARK_FAILED') }</Text>
                </View>
              </TouchableOpacity>
            </Footer>
          </Container>
          { this.renderLoader() }
        </View>
      </Modal>
    );
  }

  static renderSwipeoutLeftButton() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="checkmark" style={{ color: '#fff' }} />
      </View>
    )

  }

  static renderSwipeoutRightButton() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="warning" style={{ color: '#fff' }} />
      </View>
    )
  }

  renderSwipeOutButton() {

    const { width } = Dimensions.get('window')
    const { task } = this.props.navigation.state.params
    const { swipeOutClose } = this.state

    if (task.status === 'DONE') {
      return (
        <Footer>
          <View style={ [ styles.buttonContainer, { backgroundColor: greenColor } ] }>
            <View style={ styles.buttonTextContainer }>
              <Icon name="checkmark" style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{this.props.t('COMPLETED')}</Text>
            </View>
          </View>
        </Footer>
      )
    }

    if (task.status === 'FAILED') {
      return (
        <Footer>
          <View style={ [ styles.buttonContainer, { backgroundColor: redColor } ] }>
            <View style={ styles.buttonTextContainer }>
              <Icon name="warning" style={{ color: '#fff', marginRight: 10 }} />
              <Text style={{ color: '#fff' }}>{this.props.t('FAILED')}</Text>
            </View>
          </View>
        </Footer>
      )
    }

    const swipeoutLeftButton = {
      component: TaskPage.renderSwipeoutLeftButton(),
      backgroundColor: greenColor,
      onPress: () => {
        this.setState({
          modalContextValid: true,
          modalVisible: true,
          swipeOutClose: true
        })
      }
    }

    const swipeoutRightButton = {
      component: TaskPage.renderSwipeoutRightButton(),
      backgroundColor: redColor,
      onPress: () => {
        this.setState({
          modalContextValid: false,
          modalVisible: true,
          swipeOutClose: true
        })
      }
    }

    return (
      <Swipeout buttonWidth={ width * 0.4 } left={[ swipeoutLeftButton ]} right={[ swipeoutRightButton ]} close={ swipeOutClose }>
        <View style={{ padding: 28, width }}>
          <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff', fontFamily: 'Raleway-Regular' }}>{this.props.t('END')}</Text>
        </View>
      </Swipeout>
    )
  }

  render() {

    const { task } = this.props.navigation.state.params

    const initialRegion  = {
      latitude: task.address.geo.latitude,
      longitude: task.address.geo.longitude,
      latitudeDelta: 0.0450,
      longitudeDelta: 0.0250,
    }

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Grid>
          <Row size={ 8 }>
            <Col>
              <Row size={ 2 }>
                <MapView
                  ref={ component => this.map = component }
                  style={ styles.map }
                  zoomEnabled
                  showsUserLocation
                  loadingEnabled
                  loadingIndicatorColor={"#666666"}
                  loadingBackgroundColor={"#eeeeee"}
                  initialRegion={ initialRegion }
                  onMapReady={() => this.onMapReady()}>
                  <MapView.Marker
                    identifier={ task['@id'] }
                    key={ task['@id'] }
                    coordinate={ task.address.geo }
                    pinColor={ this.pinColor(task) }
                    flat={ true }>
                  </MapView.Marker>
                </MapView>
              </Row>
              <Row size={ 3 }>
                <Col>
                  { this.renderTaskDetails() }
                </Col>
              </Row>
            </Col>
          </Row>
          { !isCompleted(task) && <Row size={ 4 } style={ styles.swipeOutHelpContainer }>
            <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
              <Text style={styles.swipeOutHelpText}>{`${this.props.t('SWIPE_TO_END')}.`}</Text>
            </View>
          </Row>
          }
        </Grid>
        { this.renderSwipeOutButton() }
        { this.renderModal() }
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff'
  },
  row: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.4)'
  },
  buttonContainer: {
    ...StyleSheet.absoluteFillObject
  },
  buttonTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  swipeOutHelpContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  swipeOutHelpText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#ccc'
  },
  taskDetailText: {
    fontSize: 12,
  }
})

function mapStateToProps (state) {
  return {
    httpClient: state.app.httpClient,
    isLoadingTasks: selectIsTasksLoading(state),
    tasks: selectTasksList(state),
  }
}

function mapDispatchToProps (dispatch) {
  return {
    markTaskFailed: (client, task, notes) => dispatch(markTaskFailed(client, task, notes)),
    markTaskDone: (client, task, notes) => dispatch(markTaskDone(client, task, notes)),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(translate()(TaskPage))
