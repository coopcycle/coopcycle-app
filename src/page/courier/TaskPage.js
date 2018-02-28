import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions, StyleSheet, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import { Container, Content, Footer, FooterTab, Text, Button, Icon, Header, Title, Left, Body, Right, Form, Item, Input, Label } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import MapView from 'react-native-maps'
import Swipeout from 'react-native-swipeout'
import moment from 'moment/min/moment-with-locales'

import { greenColor, blueColor, redColor } from "../../styles/common"
import {markTaskDoneRequest, markTaskFailedRequest} from "../../store/actions"

moment.locale('fr')

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

    let previousTaskStatus = _.find(this.props.tasks, (taskA) => taskA['@id'] === task['@id']).status,
      currentTaskStatus = _.find(nextProps.tasks, (taskA) => taskA['@id'] === task['@id']).status
    if (previousTaskStatus !== currentTaskStatus) {
      this.props.navigation.goBack()
    }
  }

  markTaskDone() {

    const { client, task } = this.props.navigation.state.params
    const { markTaskDoneRequest } = this.props
    const { notes } = this.state

    markTaskDoneRequest(client, task, notes)
  }

  markTaskFailed() {


    const { client, task } = this.props.navigation.state.params
    const { markTaskFailedRequest } = this.props
    const { notes } = this.state

    markTaskFailedRequest(client, task, notes)

  }

  onMapReady() {

    const { geolocationTracker, task } = this.props.navigation.state.params

    const coordinates = [
      geolocationTracker.getLatLng(),
      {
        latitude: task.address.geo.latitude,
        longitude: task.address.geo.longitude,
      }
    ]

    this.map.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 50,
        left: 50,
        bottom: 50,
        right: 50
      },
      animated: true
    })
  }

  renderTaskDetail(iconName, text) {
    return (
      <Row style={ styles.row }>
        <Col size={ 4 } style={ styles.iconContainer }>
          <Icon name={ iconName } style={{ color: '#ccc' }} />
        </Col>
        <Col size={ 8 }>
          <Text>{ text }</Text>
        </Col>
      </Row>
    )
  }

  renderLoader() {
    const { taskLoadingMessage } = this.props

    if (taskLoadingMessage) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{ taskLoadingMessage }</Text>
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
                  <Title style={{ fontSize: 14 }}>Annuler</Title>
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
                        <Label>Notes</Label>
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
                  <Text style={{ color: '#fff' }}>{ modalContextValid ? 'Valider' : 'Signaler un problème' }</Text>
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
        <View style={ [ styles.buttonContainer, { backgroundColor: greenColor } ] }>
          <View style={ styles.buttonTextContainer }>
            <Icon name="checkmark" style={{ color: '#fff', marginRight: 10 }} />
            <Text style={{ color: '#fff' }}>Terminée</Text>
          </View>
        </View>
      )
    }

    if (task.status === 'FAILED') {
      return (
        <View style={ [ styles.buttonContainer, { backgroundColor: redColor } ] }>
          <View style={ styles.buttonTextContainer }>
            <Icon name="warning" style={{ color: '#fff', marginRight: 10 }} />
            <Text style={{ color: '#fff' }}>Échec</Text>
          </View>
        </View>
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
      <Swipeout left={[ swipeoutLeftButton ]} right={[ swipeoutRightButton ]} close={ swipeOutClose }>
        <View style={{ padding: 18, width }}>
          <Text style={{ textAlign: 'center', color: '#fff', fontFamily: 'Raleway-Regular' }}>Terminer</Text>
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

    const taskTimeframe = moment(task.doneAfter).format('LT') + ' - ' + moment(task.doneBefore).format('LT'),
      address = task.address.name ? [task.address.name, task.address.streetAddress].join(' - ') : task.address.streetAddress

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Grid>
          <Row size={ 8 }>
            <Col>
              <Row size={ 1 }>
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
                    pinColor={ task.type === 'PICKUP' ? blueColor : greenColor }
                    flat={ true }>
                  </MapView.Marker>
                </MapView>
              </Row>
              <Row size={ 1 }>
                <Col>
                  { this.renderTaskDetail('md-navigate', address) }
                  { this.renderTaskDetail('md-clock', taskTimeframe) }
                  { task.comments && this.renderTaskDetail('md-chatbubbles', task.comments) }
                </Col>
              </Row>
            </Col>
          </Row>
          <Row size={ 4 } style={ styles.swipeOutHelpContainer }>
            <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
              <Text style={ styles.swipeOutHelpText }>Glissez vers la droite pour terminer, ou vers la gauche en cas de problème.</Text>
            </View>
          </Row>
        </Grid>
        <Footer>
          { this.renderSwipeOutButton() }
        </Footer>
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
    borderBottomColor: '#ccc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
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
    justifyContent: 'center'
  },
  swipeOutHelpText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#ccc'
  }
})

function mapStateToProps (state) {
  return {
    taskLoadingMessage: state.taskLoadingMessage,
    tasks: state.tasks
  }
}

function mapDispatchToProps (dispatch) {
  return {
    markTaskFailedRequest: (client, task, notes) => { dispatch(markTaskFailedRequest(client, task, notes)) },
    markTaskDoneRequest: (client, task, notes) => { dispatch(markTaskDoneRequest(client, task, notes)) }
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(TaskPage)
