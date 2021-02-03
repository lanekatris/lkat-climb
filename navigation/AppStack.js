import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import {Button, Icon} from 'react-native-elements';
import {useContext} from "react";
import {AuthUserContext} from "./AuthUserProvider";
import createClimb from "../commands/create-climb";
import ClimbScreen from "../screens/ClimbScreen";
import {DETAIL_VIEW_SCREEN} from "../utils/colors";
// import {useNavigation} from "@react-navigation/native";
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "../screens/SettingsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AppStack() {
  const {user: {uid}} = useContext(AuthUserContext);
  // const navigation = useNavigation();
  console.log('uid', uid)

  return (
    <>
      <Stack.Navigator>

        <Stack.Screen name="Your Climbs" component={HomeScreen}

                      options={({navigation}) => ({
                        headerRight: () => <Button type="clear"
                                                   icon={<Icon name="add" type="material" onPress={async () => {
                                                     const newClimb = await createClimb(uid)
                                                     console.log('newclimb', newClimb)
                                                     navigation.navigate(DETAIL_VIEW_SCREEN, newClimb)
                                                   }}/>}/>,
                      })}/>

        <Stack.Screen name={DETAIL_VIEW_SCREEN} component={ClimbScreen} options={({route}) => ({
          title: `${route.params.name}`
        })}/>
      </Stack.Navigator>
    </>
  );
}

const Tab = createBottomTabNavigator();


function SettingsStack() {
  return <Stack.Navigator>
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
}

export default function BottomTabNavigator(){
  return <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          // iconName = focused
          //   ? 'ios-information-circle'
          //   : 'ios-information-circle-outline';
          iconName = 'home'
        }
        else if (route.name === 'Settings') {
          iconName = 'settings'
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color}/>;
      },
    })}
    tabBarOptions={{
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home" component={AppStack} />
    <Tab.Screen name="Settings" component={SettingsStack} />
  </Tab.Navigator>
}
