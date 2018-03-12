import React from 'react'
import { HomeTab } from '../src/page/HomeTab'
import { shallow } from 'enzyme'


/*
  Dummy test - "hello world" for testing
 */
it('renders correcty', () => {
  const tree = shallow(<HomeTab  t={key => key}/>)
  expect(tree).toMatchSnapshot()
})
