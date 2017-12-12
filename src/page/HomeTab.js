import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from 'react-native'
import {
  Container, Header, Title, Content,
  Left, Right, Body,
  Text, Icon,
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid';

const styles = StyleSheet.create({
  restaurant: {
    backgroundColor: '#f5f5f5',
  },
  restaurantTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5
  },
  restaurantText: {
    color: '#8a8a8a',
    fontSize: 14
  },
  content: {
    backgroundColor: '#fff'
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerRow: {
    flex: 1,
    alignItems: 'center',
    justifyContent:'center',
    marginBottom: 5,
  }
});

class HomeTab extends Component {
  render() {
    const { height, width } = Dimensions.get('window')
    return (
      <Container>
        <Content style={ styles.content }>
          <View style={ styles.restaurant }>
            <Grid>
              <Col size={ 25 }>
                <View style={{ ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent:'center' }}>
                  <Icon name="restaurant" style={{ color: '#e4022d' }} />
                </View>
              </Col>
              <Col size={ 75 } style={{ padding: 20 }}>
                <Text style={ styles.restaurantTitle }>Trouvez un restaurant</Text>
                <Text style={ styles.restaurantText }>Cherchez à proximité, découvrez les menus, passez votre commande</Text>
              </Col>
            </Grid>
          </View>
          <View style={ styles.wrapper }>
            <Image
              style={{ width: width, height: (width / 3.58) }}
              source={require('../assets/images/home-bg.png')} />
            <Grid style={{ paddingHorizontal: 20, marginTop: 20 }}>
              <Row style={ styles.disclaimerRow }>
                <Text style={{ fontWeight: 'bold' }}>Bienvenue !</Text>
              </Row>
              <Row style={ styles.disclaimerRow }>
                <Text style={{ textAlign: 'center' }}>Nous sommes actuellement en phase de tests alpha de l'application mobile.</Text>
              </Row>
              <Row style={ styles.disclaimerRow }>
                <Text style={{ textAlign: 'center' }}>
                  Veillez à mettre à jour régulièrement l'application pour disposer de la toute dernière version et n'hésitez pas à envoyer un rapport d'erreur en cas de plantage.
                  </Text>
              </Row>
            </Grid>
          </View>
        </Content>
      </Container>
    )
  }
}

module.exports = HomeTab
