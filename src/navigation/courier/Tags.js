import React from 'react'
import {
  Container, Right,
  Body, Content, Text,
  List, ListItem, Radio,
} from 'native-base'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import {
  filterTasks,
  clearTasksFilter,
  selectIsTagHidden,
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(Tags))
