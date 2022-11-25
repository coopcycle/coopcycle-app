import { PermissionsAndroid, Platform } from 'react-native'

export function getMissingAndroidPermissions() {

  return new Promise((resolve, reject) => {

    if (Platform.OS === 'android' && Platform.Version < 23) {
      resolve([])
      return
    }

    let wantedPermissions = []

    if (Platform.Version >= 31) {
      wantedPermissions = [
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ];
    } else {
      // Make sure we have "ACCESS_COARSE_LOCATION " or "ACCESS_FINE_LOCATION" permission or scan won't work
      wantedPermissions = [
        Platform.Version >= 29 ?
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION : PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
      ]
    }

    Promise.all(
      wantedPermissions.map(wantedPermission => PermissionsAndroid.check(wantedPermission))
    ).then(grantedPermissions => {

      const missingPermissions = wantedPermissions.reduce(
        (accumulator, permission) => {
          const isGranted = grantedPermissions[wantedPermissions.indexOf(permission)]
          if (!isGranted) {
            accumulator.push(permission)
          }

          return accumulator
        },
        []
      )

      resolve(missingPermissions)
    })
  })
}

export function canStartBluetooth() {

  return new Promise((resolve, reject) => {

    if (Platform.OS === 'ios') {
      resolve(true)
      return
    }

    // https://reactnative.dev/docs/permissionsandroid
    // On devices before SDK version 23, the permissions are automatically granted if they appear in the manifest,
    // so check should always result to true and request should always resolve to PermissionsAndroid.RESULTS.GRANTED.
    if (Platform.OS === 'android' && Platform.Version < 23) {
      resolve(true)
      return
    }

    getMissingAndroidPermissions().then(missingPermissions => {
      resolve(missingPermissions.length === 0)
    })

  })
}
