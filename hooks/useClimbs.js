import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as firebase from 'firebase';
import { AuthUserContext } from '../navigation/AuthUserProvider';
import { getStatsForClimb } from './useClimbScreen';

const climbsRef = firebase.firestore().collection('climbs');

function useClimbs() {
  const {
    user: { uid },
  } = useContext(AuthUserContext);
  const [climbs, setClimbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const getClimbs = useCallback(() => {
    setLoading(true);
    climbsRef
      .where('userId', '==', uid)
      .where('deleted', '==', false)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        (querySnapshot) => {
          const newClimbs = [];
          querySnapshot.forEach((doc) => {
            const newClimb = doc.data();
            newClimb.id = doc.id;
            newClimb.stats = getStatsForClimb(newClimb);
            newClimbs.push(newClimb);
          });
          setClimbs(newClimbs);
          setLoading(false);
        },
        (_error) => {
          console.error(_error);
          setError(_error);
          setLoading(false);
        }
      );
  }, [uid]);

  useEffect(() => {
    getClimbs();
  }, []);

  return {
    climbs,
    loading,
    error,
    getClimbs,
  };
}

export default useClimbs;
