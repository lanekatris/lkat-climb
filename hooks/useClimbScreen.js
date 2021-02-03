import * as firebase from 'firebase';
import { useContext, useEffect, useState } from 'react';
import { GRADES } from '../utils/colors';
import { AuthUserContext } from '../navigation/AuthUserProvider';

const climbsRef = firebase.firestore().collection('climbs');
const DEFAULT_PREVIOUS_STATS = {};
GRADES.forEach((grade) => {
  DEFAULT_PREVIOUS_STATS[grade] = '...';
});

export function createEvent(type, difficulty) {
  return {
    createdOn: new Date().toISOString(),
    type,
    difficulty,
    version: 1,
  };
}

function getEmoji({ current, goal }) {
  if (current < 0) return 'emoticon-poop-outline';
  if (current === 0) return 'emoticon-frown-outline';
  if (current === goal) return 'emoticon-cool-outline';
  if (current > goal) return 'emoticon-devil-outline';
  if (current > 0) return 'emoticon-happy-outline';
  throw new Error('unknown', { current, goal });
}

async function getPreviousClimbStats(uid, createdAt) {
  const previousClimbRef = await climbsRef
    .where('userId', '==', uid)
    .where('deleted', '==', false)
    .where('createdAt', '<', createdAt)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();

  const previousClimb = previousClimbRef.empty ? null : previousClimbRef.docs[0].data();

  const previousStats = {};
  GRADES.forEach((grade) => {
    previousStats[grade] = 0;
  });

  if (previousClimb) {
    previousClimb.events.forEach(({ createdOn, difficulty, type }) => {
      switch (type) {
        case 'route-retracted':
          previousStats[difficulty] -= 1;
          break;
        case 'route-completed':
          previousStats[difficulty] += 1;
          break;
        default:
          console.warn('unknown', { createdOn, difficulty, type });
          break;
      }
    });
  }

  return previousStats;
}

export function getStatsForClimb(climb) {
  const stats = {};
  GRADES.forEach((grade) => {
    stats[grade] = {
      current: 0,
    };
  });

  climb.events.forEach(({ createdOn, difficulty, type }) => {
    switch (type) {
      case 'route-retracted':
        stats[difficulty].current -= 1;
        break;
      case 'route-completed':
        stats[difficulty].current += 1;
        break;
      default:
        console.warn('unknown', { createdOn, difficulty, type });
        break;
    }

    if (['route-retracted', 'route-complted'].includes(type)) {
      stats[difficulty].emoji = getEmoji(stats[difficulty]);
    }
  });

  stats.totalClimbs = Object.values(stats).reduce(
    (total, num) => total + Math.round(num.current),
    0
  );

  let maxGrade = 'n/a';
  Object.keys(stats).forEach((key) => {
    const val = stats[key];
    if (val.current > 0) {
      maxGrade = `V${key}`;
    }
  });
  stats.maxGrade = maxGrade;

  return stats;
}

function useClimbScreen({ documentId }) {
  const {
    user: { uid },
  } = useContext(AuthUserContext);
  const [climb, setClimb] = useState({});
  const [documentRef, setDocumentRef] = useState();
  const [goals, setGoals] = useState(DEFAULT_PREVIOUS_STATS);

  function onSnapshot(doc) {
    if (!doc.exists) return;

    const d = doc.data();

    d.stats = getStatsForClimb(d);
    setClimb(d);
  }

  useEffect(() => {
    const _ref = climbsRef.doc(documentId);
    setDocumentRef(_ref);
    const subscriber = _ref.onSnapshot(onSnapshot, (err) => console.error(err));
    return () => subscriber();
  }, [documentId]);

  useEffect(() => {
    if (!climb) return;
    if (!climb.createdAt) return;

    console.log('load previous stats bro');
    getPreviousClimbStats(uid, climb.createdAt).then((_previousStats) => {
      setGoals(_previousStats);
    });
  }, [climb]);

  function incrementOrDecrement(type, difficulty) {
    return documentRef.update({
      events: firebase.firestore.FieldValue.arrayUnion(createEvent(type, difficulty)),
    });
  }

  return {
    climb,
    goals,
    increment: (difficulty) => incrementOrDecrement('route-completed', difficulty),
    decrement: (difficulty) => incrementOrDecrement('route-retracted', difficulty),
  };
}

export default useClimbScreen;
