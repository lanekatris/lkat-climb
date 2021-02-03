import React, { useCallback } from 'react';
import { ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import 'firebase/firestore';

import { ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import useStatusBar from '../hooks/useStatusBar';

import { DETAIL_VIEW_SCREEN } from '../utils/colors';
import useClimbs from '../hooks/useClimbs';

export default function HomeScreen() {
  useStatusBar('dark-content');

  const navigation = useNavigation();
  const { climbs, loading, error, getClimbs } = useClimbs();

  const handleRefresh = useCallback(() => {
    getClimbs();
  }, [getClimbs]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}>
      {climbs.map((climb) => (
        <ListItem
          key={climb.id}
          onPress={() => {
            navigation.navigate(DETAIL_VIEW_SCREEN, { id: climb.id, name: climb.name });
          }}
        >
          <ListItem.Content>
            <ListItem.Title>{climb.name}</ListItem.Title>
            <ListItem.Subtitle>
              <Stat amount={climb.stats.totalClimbs} text="Climbs" />
              <Seperator />
              <Stat amount={climb.stats.maxGrade} text="Max Grade" />
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}
      {!loading && climbs.length === 0 && <Text>No climbs, get at it above!</Text>}
    </ScrollView>
  );
}

function Seperator() {
  return <Text> - </Text>;
}

function Stat({ amount, text }) {
  return (
    <Text>
      <Text style={{ fontWeight: 'bold' }}>{amount}</Text> {text}
    </Text>
  );
}
