import {nanoid} from "nanoid";
import * as firebase from 'firebase';
import 'firebase/firestore';

const climbsRef = firebase.firestore().collection('climbs');

export default function createClimb(userId) {
  console.log('create')
  const payload = {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    name: `${new Intl.DateTimeFormat().format()}-${nanoid()}`,
    userId
  }
  return climbsRef.add(payload).then(doc => {
    console.log('done')
  }).catch(err => {
    console.error(err);
  })
}
