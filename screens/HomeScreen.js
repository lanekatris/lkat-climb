import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import 'firebase/firestore';

import useStatusBar from '../hooks/useStatusBar';
import { logout } from '../components/Firebase/firebase';
import {Button, Header, ListItem, SocialIcon, ThemeProvider} from 'react-native-elements';
import * as firebase from 'firebase';
import {AuthUserContext} from "../navigation/AuthUserProvider";
import createClimb from "../commands/create-climb";
import {useNavigation} from "@react-navigation/core";
import {DETAIL_VIEW_SCREEN} from "../navigation/AppStack";

export default function HomeScreen() {
  useStatusBar('dark-content');

  const [climbs,setClimbs] = useState([]);

  const climbsRef = firebase.firestore().collection('climbs');
  const {user:{uid}} = useContext(AuthUserContext);
  const navigation=useNavigation();
  // console.log('data',{uid,climbs})

  useEffect(() => {
    climbsRef.where('userId','==', uid)
      .onSnapshot(querySnapshot => {
        const newClimbs = [];
        querySnapshot.forEach(doc => {
          const newClimb = doc.data();
          newClimb.id = doc.id;
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

  // function create(){
  //   // console.log('create')
  //   // const payload = {
  //   //   createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  //   //   name: `${new Intl.DateTimeFormat().format()}-${nanoid()}`,
  //   //   userId: uid
  //   // }
  //   // climbsRef.add(payload).then(doc => {
  //   //   console.log('done')
  //   // }).catch(err => {
  //   //   console.error(err);
  //   // })
  //   createClimb(uid);
  // }

  return (
    // <ThemeProvider>
    <ScrollView>

      {/*<Header centerComponent={{text: 'Your Climbs'}} />*/}
      {
        climbs.map(climb => <ListItem key={climb.id} onPress={() => {
          // console.log('click', climb)
          navigation.navigate(DETAIL_VIEW_SCREEN, climb)
        }}>
          <ListItem.Content>
            <ListItem.Title>{climb.name}</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>)
      }
      {climbs.length === 0 && <Text>No climbs, get at it above!</Text>}
  {/*<Button title="Sign Out" onPress={handleSignOut} />*/}
  {/*    <Button title="Create" onPress={create} />*/}
      {/*<SocialIcon*/}
      {/*  button*/}
      {/*  title="Create"*/}
      {/*/>*/}
    </ScrollView>
    // </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
