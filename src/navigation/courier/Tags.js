import React from 'react'
import { View } from 'react-native'
import {
  Container, Header, Button, Icon, Left, Right,
  Body, Title, Content, Text,
  List, ListItem, Radio
} from 'native-base'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'

import {
  filterTasks,
  clearTasksFilter,
  selectIsTagHidden,
  selectFilteredTasks,
  selectTagNames,
} from '../../redux/Courier'

const Tags = ({
    toggleDisplayTag,
    isTagHidden,
    tags,
    t,
  }) => (
    <Container>
      <Content>
        <List>
        { tags.map(tag => {

          return (
            <ListItem key={ tag } onPress={ () => toggleDisplayTag(tag, isTagHidden(tag)) }>
              <Body>
                <Text>{ tag }</Text>
              </Body>
              <Right>
                <Radio selected={ isTagHidden(tag) } />
              </Right>
            </ListItem>
          )
        }) }
        </List>
      </Content>
    </Container>
)

function mapStateToProps(state) {
  return {
    tags: selectTagNames(state),
    isTagHidden: selectIsTagHidden(state),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDisplayTag: (tag, hidden) => dispatch(hidden ? clearTasksFilter({ tags: tag }) : filterTasks({ tags: tag })),
  }
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(withNamespaces('common')(Tags))
