import React from 'react'
import { Home } from '../src/navigation/Home'
import { shallow } from 'enzyme'


/*
  Dummy test - "hello world" for testing
 */
it('renders correcty', () => {
  const tree = shallow(<Home t={key => key}/>)
  expect(tree).toMatchSnapshot()
})
