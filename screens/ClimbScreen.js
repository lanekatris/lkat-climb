import { ScrollView, Text, View } from 'react-native';
import React from 'react';
import { ListItem, Icon, Button } from 'react-native-elements';
import useClimbScreen from '../hooks/useClimbScreen';
import { GRADES } from '../utils/colors';

const FONT_SIZE = 30;

export default function ClimbScreen({ route }) {
  const {
    params: { id },
  } = route;
  const { climb, goals, increment, decrement } = useClimbScreen({ documentId: id });

  return (
    <ScrollView>
      {climb &&
        climb.stats &&
        GRADES.map((grade, i) => (
          <ListItem key={grade} bottomDivider>
            <ListItem.Content
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'stretch',
                justifyContent: 'center',
              }}
            >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <View>
                  <Button
                    type="clear"
                    icon={<Icon name="minus" type="material-community" size={FONT_SIZE} />}
                    onPress={() => {
                      decrement(grade);
                    }}
                  />
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: FONT_SIZE }}>V{i}</Text>
                </View>
                <View>
                  <Button
                    type="clear"
                    icon={<Icon name="plus" type="material-community" size={FONT_SIZE} />}
                    onPress={() => {
                      increment(grade);
                    }}
                  />
                </View>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ justifyContent: 'center' }}>
                  <Text style={{ fontSize: FONT_SIZE }}>
                    {climb.stats[grade].current}/{goals[grade]}
                  </Text>
                </View>
                <View style={{ justifyContent: 'center' }}>
                  <Icon
                    name={climb.stats[grade].emoji}
                    type="material-community"
                    size={FONT_SIZE}
                    style={{ marginLeft: 10 }}
                  />
                </View>
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
    </ScrollView>
  );
}
