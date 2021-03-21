import { ScrollView, Text, View, StyleSheet } from 'react-native';
import React from 'react';
import { ListItem, Icon, Button } from 'react-native-elements';
import useClimbScreen from '../hooks/useClimbScreen';
import { GRADES } from '../utils/colors';

const FONT_SIZE = 30;

function Attempts({ attempt, attempts }) {
  return (
    <>
      <View>
        <Button type="clear" onPress={attempt} icon={<Icon name="elderly" type="material" />} />
      </View>
      <View>
        <Text style={{ fontSize: FONT_SIZE }}>{attempts}</Text>
      </View>
      <View style={{ borderRightWidth: 2, borderRightColor: 'lightgrey', paddingRight: 20 }} />
    </>
  );
}

function SenderOrMender({ increment, decrement, grade, i }) {
  return (
    <>
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
      <View style={{ borderRightWidth: 2, borderRightColor: 'lightgrey' }} />
    </>
  );
}

function Stats({ goals, grade, climb }) {
  return (
    <>
      <View style={{ justifyContent: 'center', paddingLeft: 20 }}>
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
    </>
  );
}

export default function ClimbScreen({ route }) {
  const {
    params: { id },
  } = route;
  const { climb, goals, increment, decrement, attempt } = useClimbScreen({ documentId: id });

  return (
    <ScrollView>
      {climb &&
        climb.stats &&
        GRADES.map((grade, i) => (
          <ListItem key={grade} bottomDivider>
            <ListItem.Content style={styles.itemWrapper}>
              <View style={styles.item}>
                <Attempts attempts={climb.stats[grade].attempts} attempt={() => attempt(grade)} />
                <SenderOrMender increment={increment} decrement={decrement} grade={grade} i={i} />
                <Stats goals={goals} grade={grade} climb={climb} />
              </View>
            </ListItem.Content>
          </ListItem>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
