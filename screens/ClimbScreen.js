import {ScrollView, Text, View} from "react-native";
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from "@react-navigation/core";
import {AuthUserContext} from "../navigation/AuthUserProvider";
import { ListItem, Avatar,Icon, Button } from 'react-native-elements'
import * as firebase from 'firebase';

const grades =[0,1,2,3,4,5,6,7,8,9,10,11,12]
const climbsRef = firebase.firestore().collection('climbs');

export default function ClimbScreen({route}) {
  const {user:{uid}} = useContext(AuthUserContext);
  const {params:{id,name}} = route;
  const [climb,setClimb] = useState({});
  const [ref,setRef] = useState();


useEffect(() => {
  console.log('Watching record',{uid, id})
  const _ref = climbsRef
    .doc(id);
  setRef(_ref);

    _ref.onSnapshot(doc => {
      // console.log('detail osnapshot', querySnapshot);
      const d = doc.data();

      // Take the data and find out total values
      const stats = {}
      grades.forEach(grade => {
        stats[grade] = 0
      })
      d.events.forEach(({createdOn, difficulty, type}) => {
        switch (type){
          case 'route-retracted':
            stats[difficulty]--;
            break;
          case 'route-completed':
            stats[difficulty]++;
            break;
          default:
            console.warn('unknown',{createdOn, difficulty, type})
            break;
        }
      })

      d.stats=stats;
      setClimb(d);
      console.log('detail climb', d)
    }, err=>{
      console.error(error)
    })
},[])

  function decrement(difficulty){
    ref.update({
      events: firebase.firestore.FieldValue.arrayUnion({
        createdOn: new Date().toISOString(), //firebase.firestore.FieldValue.serverTimestamp(),
        type: 'route-retracted',
        difficulty,
        version: 1
      })
    })
  }
  function increment(difficulty){
    ref.update({
      events: firebase.firestore.FieldValue.arrayUnion({
        createdOn: new Date().toISOString(), //firebase.firestore.FieldValue.serverTimestamp(),
        type: 'route-completed',
        difficulty,
        version: 1
      })
    })
  }

  const FONT_SIZE=30

  return <ScrollView>
    {
      climb && climb.stats && grades.map((grade,i) => <ListItem key={i} bottomDivider>
        <ListItem.Content style={{flex:1,flexDirection:'row',backgroundColor:'red', alignItems:'stretch', justifyContent:"center"}}>
          <View style={{backgroundColor:'blue', flex:1,flexDirection:'row', justifyContent:"center"}}>

            <View>
              <Button type="clear" icon={<Icon name="minus" type="material-community" size={FONT_SIZE} />} onPress={() => {
              console.log('you clicked minus for', grade)
                decrement(grade)
              }
              } />
            </View>
            <View style={{justifyContent:'center'}}>
              <Text style={{fontSize:FONT_SIZE}}>V{i}</Text>
            </View>
            <View>
              <Button type="clear" icon={<Icon name="plus" type="material-community" size={FONT_SIZE} />} onPress={()=>{
              increment(grade)}
              }/>
            </View>

          </View>
          <View style={{backgroundColor:'orange', flex:1,flexDirection:'row', justifyContent:"center"}}>
            <View style={{justifyContent:'center'}}>
              <Text style={{fontSize:FONT_SIZE}}>{climb.stats[grade]}/?</Text>
            </View>
            <View style={{justifyContent:'center'}}>
              <Icon name="emoticon-dead" type="material-community" size={FONT_SIZE} style={{marginLeft:10}} />
            </View>
          </View>

        </ListItem.Content>
      </ListItem>)
    }
  </ScrollView>
}
