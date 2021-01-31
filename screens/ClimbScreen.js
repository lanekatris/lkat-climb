import {ScrollView, Text, View} from "react-native";
import React, {useContext, useDebugValue, useEffect, useState} from 'react';
import {AuthUserContext} from "../navigation/AuthUserProvider";
import {ListItem, Avatar, Icon, Button} from 'react-native-elements'
import * as firebase from 'firebase';

const grades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const climbsRef = firebase.firestore().collection('climbs');

function getEmoji({current, goal}) {
  if (current < 0) return 'emoticon-poop-outline';
  if (current === 0) return 'emoticon-frown-outline';
  if (current === goal) return 'emoticon-cool-outline';
  if (current > goal) return 'emoticon-devil-outline';
  if (current > 0) return 'emoticon-happy-outline';
  throw new Error('unknown', {current, goal})
}

async function getPreviousClimbStats(uid, createdAt) {
  const previousClimbRef = await climbsRef
    .where('userId', '==', uid)
    .where('createdAt', '<', createdAt)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
  const previousClimb = previousClimbRef.empty ? null : previousClimbRef.docs[0].data()

  const previousStats = {};
  grades.forEach(grade => {
    previousStats[grade] = 0
  })

  // if (!previousClimb) return previousStats;

  if (previousClimb) {
    previousClimb.events.forEach(({createdOn, difficulty, type}) => {
      switch (type) {
        case 'route-retracted':
          previousStats[difficulty]--;
          break;
        case 'route-completed':
          previousStats[difficulty]++;
          break;
        default:
          console.warn('unknown', {createdOn, difficulty, type})
          break;
      }
    })
  }

  return previousStats;
}

export default function ClimbScreen({route}) {
  const {user: {uid}} = useContext(AuthUserContext);
  const {params: {id, name}} = route;
  const [climb, setClimb] = useState({});
  const [ref, setRef] = useState();
  // const [previousClimbStats, setPreviousClimbStats]=useState();

  useEffect(() => {
    const _ref = climbsRef
      .doc(id);
    setRef(_ref);

    const subscriber = _ref.onSnapshot({includeMetadataChanges: true}, async doc => {
      const d = doc.data();

      if (!d) {
        return;
      }

      const stats = {}
      grades.forEach(grade => {
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
      setClimb(d);
    }, err => {
      console.error(error)
    })

    return () => subscriber();
  }, [id])

  function decrement(difficulty) {
    ref.update({
      events: firebase.firestore.FieldValue.arrayUnion({
        createdOn: new Date().toISOString(), //firebase.firestore.FieldValue.serverTimestamp(),
        type: 'route-retracted',
        difficulty,
        version: 1
      })
    })
  }

  function increment(difficulty) {
    ref.update({
      events: firebase.firestore.FieldValue.arrayUnion({
        createdOn: new Date().toISOString(), //firebase.firestore.FieldValue.serverTimestamp(),
        type: 'route-completed',
        difficulty,
        version: 1
      })
    })
  }

  const FONT_SIZE = 30

  return <ScrollView>
    {
      climb && climb.stats && grades.map((grade, i) => <ListItem key={i} bottomDivider>
        <ListItem.Content style={{flex: 1, flexDirection: 'row', alignItems: 'stretch', justifyContent: "center"}}>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: "center"}}>

            <View>
              <Button type="clear" icon={<Icon name="minus" type="material-community" size={FONT_SIZE}/>}
                      onPress={() => {
                        decrement(grade)
                      }
                      }/>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={{fontSize: FONT_SIZE}}>V{i}</Text>
            </View>
            <View>
              <Button type="clear" icon={<Icon name="plus" type="material-community" size={FONT_SIZE}/>}
                      onPress={() => {
                        increment(grade)
                      }
                      }/>
            </View>

          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: "center"}}>
            <View style={{justifyContent: 'center'}}>
              <Text style={{fontSize: FONT_SIZE}}>{climb.stats[grade].current}/{climb.stats[grade].goal}</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Icon name={climb.stats[grade].emoji} type="material-community" size={FONT_SIZE}
                    style={{marginLeft: 10}}/>
            </View>
          </View>

        </ListItem.Content>
      </ListItem>)
    }
  </ScrollView>
}
