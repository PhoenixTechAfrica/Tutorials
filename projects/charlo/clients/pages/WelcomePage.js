import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Layout, Button, Text, Spinner } from '@ui-kitten/components';

import { kit } from '../root';
import { walletActions } from '../store/actions';


export const WelcomePage = ({navigation}) => {
  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet);

  const login = async () => {
    if (!kit.defaultAccount) {
      await dispatch(walletActions.connect());

      await dispatch(walletActions.getRole());

      navigation.navigate("ProposalsPage");

    } else navigation.navigate("ProposalsPage");
  }

  return (
    <Layout style={styles.container}>
      <Button
        raised='true'
        onPress={login}
        accessoryLeft={wallet.loading ? loadingIndicator : ""}
      >Connect To Wallet</Button>

      <Text style={styles.text}>
        Welcome to the Charity example DAO
      </Text>
    </Layout>
  );
};

const loadingIndicator = (props) => {
  return(
    <View style={[props.style, styles.indicator]}>
      <Spinner size='small' status='basic' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    paddingTop: 10,
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
