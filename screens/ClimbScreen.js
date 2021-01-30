import {Text, View} from "react-native";
import React, {useContext, useEffect, useState} from 'react';
import {useNavigation} from "@react-navigation/core";
import {AuthUserContext} from "../navigation/AuthUserProvider";

export default function ClimbScreen({route}) {
  const {user:{uid}} = useContext(AuthUserContext);
const params = useNavigation();
const {params:{id,name}} = route
  // console.log('params',params,ugh);
  return <View>
    <Text>hi theree {name}</Text>
  </View>
}
