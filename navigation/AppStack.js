import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import {Button, Icon} from 'react-native-elements';
import {useContext} from "react";
import {AuthUserContext} from "./AuthUserProvider";
import createClimb from "../commands/create-climb";
import ClimbScreen from "../screens/ClimbScreen";
// import {useNavigation} from "@react-navigation/native";

const Stack = createStackNavigator();

export default function AppStack() {
  const {user:{uid}} = useContext(AuthUserContext);
  // const navigation = useNavigation();
  console.log('uid',uid)

  return (
    <Stack.Navigator>
      <Stack.Screen name="Your Climbs" component={HomeScreen}

      options={({navigation}) => ({
        headerRight: () => <Button  type="clear" icon={<Icon name="add" type="material" onPress={async () => {
        await createClimb(uid)
        navigation.navigate("Complete me")
      }} />} />
      })} />

      <Stack.Screen name="Complete me" component={ClimbScreen} />
    </Stack.Navigator>
  );
}
