import * as firebase from 'firebase';
import 'firebase/firestore';
import dockerNames from 'docker-names';
import { nanoid } from 'nanoid/async/index.native';

const climbsRef = firebase.firestore().collection('climbs');

export default function createClimb(userId) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const payload = {
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      name: `${new Date().toLocaleDateString()} - ${dockerNames.getRandomName()}`,
      userId,
      id: await nanoid(),
      events: [],
      deleted: false,
    };
    climbsRef
      .add(payload)
      .then((doc) => {
        resolve({
          id: doc.id,
          name: payload.name,
        });
      })
      .catch(reject);
  });
}
