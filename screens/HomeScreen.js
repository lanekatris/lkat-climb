import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import 'firebase/firestore';

import useStatusBar from '../hooks/useStatusBar';
import {Button, Header, ListItem, Text, SocialIcon, ThemeProvider, Divider} from 'react-native-elements';

import {useNavigation} from "@react-navigation/core";
import {DETAIL_VIEW_SCREEN} from "../utils/colors";
import useClimbs from '../hooks/useClimbs';

export default function HomeScreen() {
  useStatusBar('dark-content');

  const navigation=useNavigation();
  const {climbs, loading, error} = useClimbs();

  if (loading) return <ActivityIndicator size="large" />;

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
      {!loading && climbs.length === 0 && <Text>No climbs, get at it above!</Text>}
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
