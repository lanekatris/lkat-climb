import React, {useContext, useEffect, useState} from 'react';
import * as firebase from 'firebase';
import {AuthUserContext} from '../navigation/AuthUserProvider'
import {getStatsForClimb} from './useClimbScreen'

const climbsRef = firebase.firestore().collection('climbs');

function useClimbs() {
    const {user:{uid}} = useContext(AuthUserContext);
    const [climbs,setClimbs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        setLoading(true);
        climbsRef.where('userId','==', uid)
          .orderBy('createdAt', 'desc')
          .onSnapshot(querySnapshot => {
            const newClimbs = [];
            querySnapshot.forEach(doc => {
              const newClimb = doc.data();
              newClimb.id = doc.id;
              newClimb.stats = getStatsForClimb(newClimb)
              newClimbs.push(newClimb);
            })
            setClimbs(newClimbs);
            setLoading(false);
          }, _error => {
            console.error(_error)
            setError(_error);
            setLoading(false);
          })
      }, [])

    return {
        climbs,
        loading,
        error
    }
}

export default useClimbs;