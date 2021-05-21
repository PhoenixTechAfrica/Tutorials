import * as React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Root'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function HomeScreen({navigation}: Props) {
  // const alert = useSelector(state => state.alert)

  return (
    <View style={styles.container}>
      <Button
        title='Connect Wallet'
        onPress={() => navigation.navigate('AllProposalScreen')}
        />

        <Text style={styles.text}>
          Welcome to the Charity example DAO
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    paddingTop: 10,
  }
});
