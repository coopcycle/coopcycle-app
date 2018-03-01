import React from 'react'
import LoginForm from '../src/components/LoginForm'
import { shallow } from 'enzyme'


it('renders correcty', () => {
  const tree = shallow(<LoginForm  />)
  expect(tree).toMatchSnapshot()
})

it('update state when entering input', () => {
  const tree = shallow(<LoginForm  />),
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
    login = jest.fn().mockReturnValueOnce(new Promise((resolve, reject) => { resolve() })),
    client = { login: login },
    tree = shallow(
      <LoginForm
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
  submitButton.props().onPress()

  expect(tree.state()).toEqual({ email: 'Hello', password: 'secret', error: false })
  expect(login).toHaveBeenCalledTimes(1)
  expect(login).toHaveBeenCalledWith('Hello', 'secret')
})