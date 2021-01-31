import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import {Button, Icon} from 'react-native-elements';
import {useContext} from "react";
import {AuthUserContext} from "./AuthUserProvider";
import createClimb from "../commands/create-climb";
import ClimbScreen from "../screens/ClimbScreen";
import {DETAIL_VIEW_SCREEN} from "../utils/colors";
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
        const newClimb = await createClimb(uid)
          console.log('newclimb', newClimb)
        navigation.navigate(DETAIL_VIEW_SCREEN ,newClimb)
      }} />} />
      })} />

      <Stack.Screen name={DETAIL_VIEW_SCREEN} component={ClimbScreen} options={({route}) => ({
        title: `${route.params.name}`
      })} />
    </Stack.Navigator>
  );
}
