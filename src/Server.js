import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import API from './API'

const load = () => {

  return new Promise((resolve, reject) => {
    try {
      AsyncStorage.getItem('@CoopCycle.servers')
        .then((data, e) => {
          if (e || !data) {
            return resolve([])
          }
          resolve(JSON.parse(data))
        })
    } catch (e) {
      resolve([])
    }
  })
}

const fetchRemote = () => {

  return new Promise((resolve, reject) => {
    try {
      axios.get('https://coopcycle.org/coopcycle.json')
        .then((response) => resolve(response.data))
        .catch(() => resolve([]))
    } catch (e) {
      resolve([])
    }
  })
}

const save = data => {

  return new Promise((resolve, reject) => {
    try {
      AsyncStorage
        .setItem('@CoopCycle.servers', JSON.stringify(data))
        .then(e => resolve())
        .catch(e => resolve())
    } catch (e) {
      resolve()
    }
  })
}


async function overrideCity(values) {
  console.log(values.length)
  const fail = Symbol()
  /*
  values =
    (await Promise.all(
      values.map(
        async value => (
          await
            API.checkServer(value.url, true)
          )
        .then((response) => {
          console.log(response)
          return value}).catch((err) => {
            console.log(fail)
            return fail})
      )
    )).filter(i => i !== fail)
   
p.then(value => {
  console.log(value);
}).catch(err => {
  console.log(err); // 👉️ "Something went wrong"
});

    */

    const promises = values.map(async(n) => ({
      value: n,
      include: await API.checkServer(n.url, true).then(value => {
        console.log(value);
        return true;
      }).catch(err => {
        console.log(err); // 👉️ "Something went wrong"
        return false;
      })
    }));
    const data_with_includes = await Promise.all(promises);
    console.log(data_with_includes);
    const filtered_data_with_includes = data_with_includes.filter(v => v.include);
    const filtered_data = filtered_data_with_includes.map(data => data.value);
    console.log(filtered_data.length);
  console.log(values.length)
  values = filtered_data;
  return values.map((value) => {

    if (value.city.startsWith('Ciudad de México')) {
      return {
        ...value,
        city: 'Ciudad de México',
      }
    }

    return value
  })
}

class Server {

  static loadAll() {
    return new Promise((resolve, reject) => {

      // TODO Handle cache expiration
      Promise.all([ load(), fetchRemote() ])
        .then(values => {

          const [ localData, remoteData ] = values

          if (!remoteData) {

            return resolve(overrideCity(localData))
          }

          save(remoteData)
            .then(() => resolve(overrideCity(remoteData)))

        })
    })
  }

}

export default Server