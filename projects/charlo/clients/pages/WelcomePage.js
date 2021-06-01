import * as React from 'react';
import { Alert } from 'react-native';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Button, Text } from '@ui-kitten/components';

import { kit } from '../root';
import { walletActions } from '../store/actions';

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
    <Layout style={styles.container}>
      <Button
        raised='true'
        onPress={login}
      >Connect To Wallet</Button>

      <Text style={styles.text}>
        Welcome to the Charity example DAO
      </Text>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    paddingTop: 10,
  }
});
