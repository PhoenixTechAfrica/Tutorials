import * as React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import { RootStackParamList } from '../types';
import { walletActions } from '../store/actions/walletAction';
import { kit } from '../root';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Root'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function HomeScreen({navigation}: Props) {
  const dispatch = useDispatch();
  const wallet = useSelector((state:any) => state.wallet);

  const login = async () => {
    if (!kit.defaultAccount) {
      dispatch(walletActions.connect()); 
    } else navigation.navigate("AllProposalScreen");
  }

  React.useEffect(() => {
    if (kit.defaultAccount) {
      navigation.navigate("AllProposalScreen");
    }
  });

  return (
    <View style={styles.container}>
      <Button
        title='Connect Wallet'
        onPress={login}
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
