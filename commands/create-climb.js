import * as firebase from 'firebase';
import * as Random from 'expo-random';
import 'firebase/firestore';
import dockerNames from 'docker-names'
import {nanoid} from 'nanoid/async/index.native';

const climbsRef = firebase.firestore().collection('climbs');

export default function createClimb(userId) {
  return new Promise(async (resolve, reject) => {
    console.log('create')
    const payload = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      name: `${new Date().toLocaleDateString()} - ${dockerNames.getRandomName()}`,
      userId,
      id: await nanoid()
    }
    climbsRef.add(payload).then(doc=>{
      resolve(payload)
    }).catch(reject)
  })

}
