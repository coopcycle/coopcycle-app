import React from 'react'
import { LoginForm } from '../src/components/LoginForm'
import { shallow } from 'enzyme'
import { createClient } from '../src/API'

afterEach(() => {
  fetch.resetMocks()
})

it('renders correcty', () => {
  const tree = shallow(<LoginForm t={key => key} />)
  expect(tree).toMatchSnapshot()
})

it('update state when entering input', () => {
  const tree = shallow(<LoginForm t={key => key}   />),
    usernameInput = tree.find('Styled(Input)').at(0),
    passwordInput = tree.find('Styled(Input)').at(1)

  usernameInput.props().onChangeText('Hello')
  passwordInput.props().onChangeText('secret')

  expect(tree.state()).toEqual({ email: 'Hello', password: 'secret', error: false })
})

it('submit', () => {

  const onRequestStart = jest.fn(),
    onRequestEnd = jest.fn(),
    onLoginSuccess = jest.fn(),
    onLoginFail = jest.fn(),
    // login = jest.fn().mockReturnValueOnce(new Promise((resolve, reject) => { resolve() })),
    client = createClient(),
    tree = shallow(
      <LoginForm
        t={key => key}
        onRequestStart={onRequestStart}
        onRequestEnd={onRequestEnd}
        onLoginSuccess={onLoginSuccess}
        onLoginFail={onLoginFail}
        client={client}
      />),
    usernameInput = tree.find('Styled(Input)').at(0),
    passwordInput = tree.find('Styled(Input)').at(1),
    submitButton = tree.find('Styled(Button)').at(0)

  usernameInput.props().onChangeText('Hello')
  passwordInput.props().onChangeText('secret')

  fetch.mockResponse(JSON.stringify({token: '12345', refresh_token: 'xxxxx' }))
  submitButton.props().onPress()

  expect(fetch).toHaveBeenCalledTimes(1)
})