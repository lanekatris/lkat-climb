import * as firebase from 'firebase';
import {useEffect, useState} from "react";
import {GRADES} from "../utils/colors";

const climbsRef = firebase.firestore().collection('climbs');

function createEvent(type, difficulty) {
  return {
    createdOn: new Date().toISOString(),
    type,
    difficulty,
    version: 1
  }
}

function getEmoji({current, goal}) {
  if (current < 0) return 'emoticon-poop-outline';
  if (current === 0) return 'emoticon-frown-outline';
  if (current === goal) return 'emoticon-cool-outline';
  if (current > goal) return 'emoticon-devil-outline';
  if (current > 0) return 'emoticon-happy-outline';
  throw new Error('unknown', {current, goal})
}

function useClimbScreen({documentId}){
  const [climb, setClimb] = useState({});
  const [documentRef, setDocumentRef] = useState();

  function onSnapshot(doc){
    if (!doc.exists) return;

    const d = doc.data();

    const stats = {}
    GRADES.forEach(grade => {
      stats[grade] = {
        current: 0,
        goal: 0
      }
    })

    d.events.forEach(({createdOn, difficulty, type}) => {
      switch (type) {
        case 'route-retracted':
          stats[difficulty].current--;
          break;
        case 'route-completed':
          stats[difficulty].current++;
          break;
        default:
          console.warn('unknown', {createdOn, difficulty, type})
          break;
      }

      stats[difficulty].emoji = getEmoji(stats[difficulty])
    })

    d.stats = stats;

    setClimb(d)
  }

  useEffect(() => {
    const _ref = climbsRef.doc(documentId);
    setDocumentRef(_ref);
    const subscriber = _ref.onSnapshot(onSnapshot, err => console.error(err))
    return ()=>subscriber();
  }, [documentId])

  function incrementOrDecrement(type, difficulty) {
    return documentRef.update({
      events: firebase.firestore.FieldValue.arrayUnion(createEvent(type, difficulty))
    })
  }

  return {
    climb,
    increment: difficulty => incrementOrDecrement('route-completed', difficulty),
    decrement: difficulty => incrementOrDecrement('route-retracted', difficulty)
  }
}

export default useClimbScreen;
