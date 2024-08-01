import VersionNumber from 'react-native-version-number'
import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { selectBaseURL, selectUser } from '../App/selectors'

const guestCheckoutEndpoints = [
  'getOrderValidate',
  'getOrderTiming',
  'updateOrder',
]

const appVersion = VersionNumber.bundleIdentifier +
  '@' +
  VersionNumber.appVersion +
  ' (' +
  VersionNumber.buildVersion +
  ')'

const buildBaseQuery = (baseUrl) => {
  return fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState, endpoint }) => {
      headers.set('X-Application-Version', appVersion)

      const user = selectUser(getState())
      if (user) {
        headers.set('Authorization', `Bearer ${user.token}`)
      } else if (guestCheckoutEndpoints.includes(endpoint)) {
        //todo
        // const orderAccessToken = selectOrderAccessToken(getState())
        //
        // if (orderAccessToken) {
        //   headers.set('Authorization', `Bearer ${orderAccessToken}`)
        // }
      }

      return headers
    },
    jsonContentType: 'application/ld+json',
    timeout: 30000,
  })
}

//based on https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const { getState } = api

  const baseUrl = selectBaseURL(getState()) + '/'
  const baseQuery = buildBaseQuery(baseUrl)

  let result= await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    //todo
    // try to get a new token; works only for logged in users
    // const refreshResponse = await baseQuery(
    //   window.Routing.generate('profile_jwt'),
    //   api,
    //   extraOptions,
    // )
    //
    // if (refreshResponse.data && refreshResponse.data.jwt) {
    //   api.dispatch(setAccessToken(refreshResponse.data.jwt))
    //   // retry the initial query
    //   result = await baseQuery(args, api, extraOptions)
    // } else {
    //   // api.dispatch(loggedOut())
    // }
  }
  return result
}
