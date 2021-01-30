import {ScrollView, Text, View} from "react-native";
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from "@react-navigation/core";
import {AuthUserContext} from "../navigation/AuthUserProvider";
import { ListItem, Avatar,Icon, Button } from 'react-native-elements'

const grades =[0,1,2,3,4,5,6,7,8,9,10,11,12]

export default function ClimbScreen({route}) {
  const {user:{uid}} = useContext(AuthUserContext);
  const {params:{id,name}} = route

  console.log('grades',grades)

  const FONT_SIZE=30

  return <ScrollView>
    {
      grades.map((grade,i) => <ListItem key={i} bottomDivider>
        <ListItem.Content style={{flex:1,flexDirection:'row',backgroundColor:'red', alignItems:'stretch', justifyContent:"center"}}>
          <View style={{backgroundColor:'blue', flex:1,flexDirection:'row', justifyContent:"center"}}>

            <View>
              <Button type="clear" icon={<Icon name="minus" type="material-community" size={FONT_SIZE} />} />
            </View>
            <View style={{justifyContent:'center'}}>
              <Text style={{fontSize:FONT_SIZE}}>V{i}</Text>
            </View>
            <View>
              <Button type="clear" icon={<Icon name="plus" type="material-community" size={FONT_SIZE} />} />
            </View>

          </View>
          <View style={{backgroundColor:'orange', flex:1,flexDirection:'row', justifyContent:"center"}}>
            <View style={{justifyContent:'center'}}>
              <Text style={{fontSize:FONT_SIZE}}>0/4</Text>
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
