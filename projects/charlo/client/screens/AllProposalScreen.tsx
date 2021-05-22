import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, LogBox, Button, Text } from 'react-native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { kit } from '../root';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Root'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function AllProposalScreen({ navigation }: Props) {
  const wallet = useSelector((state:any) => state.wallet);

  React.useEffect(() => {
    if (!kit.defaultAccount) {
      navigation.navigate("Root");
    }
  });

  return (
    <View style={styles.container}>
      <Text>
        All Proposals
        </Text>
        <Button
        title='Create a Proposal'
        onPress={() => navigation.navigate('CreateProposalScreen')}
        />

        <Text>{wallet.address}</Text>
        <Text>{wallet.phone}</Text>
       
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: '15%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
