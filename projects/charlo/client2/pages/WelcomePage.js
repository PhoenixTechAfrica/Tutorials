import * as React from 'react';
import { Alert } from 'react-native';
import { Button, Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { kit } from '../root';
import { walletActions } from '../store/actions/walletActions';

export const WelcomePage = ({navigation}) => {
  const dispatch = useDispatch();
  const wallet = useSelector((state) => state.wallet);

  const login = async () => {
    if (!kit.defaultAccount) {
      dispatch(walletActions.connect());
    } else navigation.navigate("ProposalsPage");
  }

  React.useEffect(() => {
    if (kit.defaultAccount) {
      navigation.navigate("ProposalsPage");
    }
  });

  return (
    <View style={styles.container}>
      <Button
        title='Connect Wallet'
        raised='true'
        onPress={login}
      />

      <Text style={styles.text}>
        Welcome to the Charity example DAO
      </Text>
    </View>
  );
};

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
