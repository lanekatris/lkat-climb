import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import 'firebase/firestore';

import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import {Button, Header, ListItem, Text, SocialIcon, ThemeProvider, Divider} from 'react-native-elements';
import * as firebase from 'firebase';
import {AuthUserContext} from "../navigation/AuthUserProvider";

import {useNavigation} from "@react-navigation/core";
import {DETAIL_VIEW_SCREEN} from "../utils/colors";
import {getStatsForClimb} from "../hooks/useClimbScreen";

export default function HomeScreen() {
  useStatusBar('dark-content');

  const [climbs,setClimbs] = useState([]);

  const climbsRef = firebase.firestore().collection('climbs');
  const {user:{uid}} = useContext(AuthUserContext);
  const navigation=useNavigation();

  useEffect(() => {
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
      }, error => {
        console.error(error)
      })
  }, [])

  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <ScrollView>
      {
        climbs.map(climb => <ListItem key={climb.id} onPress={() => {
          navigation.navigate(DETAIL_VIEW_SCREEN, {id: climb.id,name: climb.name})
        }}>
          <ListItem.Content>
            <ListItem.Title>{climb.name}</ListItem.Title>
            <ListItem.Subtitle>
              <Stat amount={climb.stats.totalClimbs} text="Climbs" />
              <Seperator />
              <Stat amount={climb.stats.maxGrade} text="Max Grade" />
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>)
      }
      {climbs.length === 0 && <Text>No climbs, get at it above!</Text>}
    </ScrollView>
  );
}

function Seperator(){
  return <Text> - </Text>
}

function Stat({amount, text}){
  return <Text><Text style={{fontWeight: 'bold'}}>{amount}</Text> {text}</Text>
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
