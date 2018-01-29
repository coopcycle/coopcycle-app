import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, View, Modal, ActivityIndicator } from 'react-native'
import { Container, Content, Footer, Text, Button, Icon, Header, Title, Left, Body, Right, Form, Item, Input, Label } from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import MapView from 'react-native-maps'
import moment from 'moment/min/moment-with-locales'

moment.locale('fr')

const COLOR_GREEN = '#2ECC71'
const COLOR_BLUE = '#3498DB'

class TaskPage extends Component {

  map = null

  constructor(props) {
    super(props)

    const { task } = this.props.navigation.state.params

    this.state = {
      task,
      modalVisible: false,
      loading: false,
      loadingMessage: 'Chargement…',
    }
  }

  componentDidMount() {
    setTimeout(() => this.map.fitToElements(false), 500)
  }

  completeTask() {

    const { client, onTaskChange } = this.props.navigation.state.params
    const { task } = this.state

    this.setState({ loading: true })
    client
      .put(task['@id'] + '/done', {})
      .then(task => {
        this.setState({ task, loading: false, modalVisible: false })
        onTaskChange(task)
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

    const { loading, loadingMessage } = this.state

    if (loading) {
      return (
        <View style={ styles.loader }>
          <ActivityIndicator
            animating={ true }
            size="large"
            color="#fff"
          />
          <Text style={{ color: '#fff' }}>{ loadingMessage }</Text>
        </View>
      );
    }

    return (
      <View />
    )
  }

  renderModal() {
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
              <Body>
                <Title style={{ fontSize: 14, textAlign: 'right' }}>Terminer la tâche</Title>
              </Body>
              <Right>
                <Button transparent onPress={ () => this.completeTask() }>
                  <Icon name="md-checkmark" style={{ color: '#fff' }} />
                </Button>
              </Right>
            </Header>
            <Content>
              <Grid>
                <Row style={{ paddingVertical: 30, paddingHorizontal: 10 }}>
                  <Col>
                    <Form>
                      <Item stackedLabel>
                        <Label>Notes</Label>
                        <Input />
                      </Item>
                    </Form>
                  </Col>
                </Row>
              </Grid>
            </Content>
          </Container>
          { this.renderLoader() }
        </View>
      </Modal>
    );
  }

  renderButton() {

    const { task } = this.state

    let buttonProps = {}
    let buttonText = 'Terminer'
    if (task.status === 'DONE') {
      buttonProps = { disabled: true }
      buttonText = 'Terminée'
    }

    return (
      <TouchableOpacity style={ styles.buttonContainer } { ...buttonProps } onPress={ () => this.setState({ modalVisible: true }) }>
        <View style={ styles.buttonTextContainer }>
          { task.status === 'DONE' && (
            <Icon name="md-checkmark" style={{ color: '#fff', marginRight: 10 }} />
          ) }
          <Text style={{ color: '#fff' }}>{ buttonText }</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {

    const { task } = this.state

    const initialRegion  = {
      latitude: task.address.geo.latitude,
      longitude: task.address.geo.longitude,
      latitudeDelta: 0.0450,
      longitudeDelta: 0.0250,
    }

    const taskTimeframe = moment(task.doneAfter).format('LT') + ' - ' + moment(task.doneBefore).format('LT')

    return (
      <Container style={{ backgroundColor: '#fff' }}>
        <Grid>
          <Row size={ 9 }>
            <Col>
              <Row>
                <MapView
                  ref={ component => this.map = component }
                  style={ styles.map }
                  zoomEnabled
                  showsUserLocation
                  loadingEnabled
                  loadingIndicatorColor={"#666666"}
                  loadingBackgroundColor={"#eeeeee"}
                  initialRegion={ initialRegion }>
                  <MapView.Marker
                    identifier={ task['@id'] }
                    key={ task['@id'] }
                    coordinate={ task.address.geo }
                    pinColor={ task.type === 'PICKUP' ? COLOR_BLUE : COLOR_GREEN }
                    flat={ true }>
                  </MapView.Marker>
                </MapView>
              </Row>
              <Row>
                <Col>
                  { this.renderTaskDetail('md-navigate', task.address.streetAddress) }
                  { this.renderTaskDetail('md-clock', taskTimeframe) }
                </Col>
              </Row>
            </Col>
          </Row>
          <Row size={ 1 } style={{ backgroundColor: '#2ECC71' }}>
            { this.renderButton() }
          </Row>
        </Grid>
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
  }
});

module.exports = TaskPage;