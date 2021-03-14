import * as React from 'react';
import { ScrollView } from 'react-native';
import { ListItem, Icon, Input, Divider, Card, Button, Text } from 'react-native-elements';
import { useCallback, useEffect, useState } from 'react';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout } from '../components/Firebase/firebase';

const registerForClasses = firebase.functions().httpsCallable('registerForClasses');

export default function SettingsScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const register = useCallback(() => {
    setLoading(true);
    setResult(null);
    AsyncStorage.setItem('@email', email);
    AsyncStorage.setItem('@password', password);
    registerForClasses({ email, password })
      .then(setResult)
      .catch(setResult)
      .finally(() => setLoading(false));
  }, [email, password]);

  useEffect(() => {
    AsyncStorage.getItem('@email').then((value) => setEmail(value || ''));
    AsyncStorage.getItem('@password').then((value) => setPassword(value || ''));
  }, []);

  return (
    <ScrollView>
      <ListItem onPress={logout}>
        <Icon name="logout" type="material" />

        <ListItem.Content>
          <ListItem.Title>Log Out</ListItem.Title>
        </ListItem.Content>
      </ListItem>
      {/* <ListItem> */}
      {/*  <Icon name="calendar-today" type="material" /> */}
      {/*  <ListItem.Title>Pre-register M/W/F in RhinoFit</ListItem.Title> */}
      {/*  <ListItem.Content> */}
      {/*    <Input placeholder="email@address.com" leftIcon={{ type: 'material', name: 'email' }} /> */}
      {/*    <Input /> */}
      {/*  </ListItem.Content> */}
      {/* </ListItem> */}
      <Card>
        <Card.Title>Pre-register M/W/F in RhinoFit</Card.Title>
        <Input
          placeholder="email@address.com"
          leftIcon={{ type: 'material', name: 'email' }}
          value={email}
          onChangeText={setEmail}
        />
        <Input
          placeholder="password"
          secureTextEntry
          leftIcon={{ type: 'material', name: 'lock' }}
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title="Register this week"
          type="outline"
          loading={loading}
          disabled={loading}
          onPress={() => {
            console.log('register', { email, password });
            register();
          }}
        />
        {result && <Text>{JSON.stringify(result, null, 2)}</Text>}
      </Card>
    </ScrollView>
  );
}
