import * as React from 'react';
import { ScrollView } from 'react-native';
import {
  Button,
  Header,
  ListItem,
  Text,
  SocialIcon,
  ThemeProvider,
  Divider,
  Icon,
} from 'react-native-elements';
import { logout } from '../components/Firebase/firebase';

export default function SettingsScreen() {
  return (
    <ScrollView>
      <ListItem onPress={logout}>
        <Icon name="logout" type="material" />

        <ListItem.Content>
          <ListItem.Title>Log Out</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </ScrollView>
  );
}
