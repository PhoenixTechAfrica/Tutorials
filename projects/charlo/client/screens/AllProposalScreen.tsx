import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, LogBox, Button, Text, TextInput } from 'react-native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { kit, web3 } from '../root';
import { walletActions } from '../store/actions/walletAction';
import BigNumber from 'bignumber.js';
import { proposalActions } from '../store/actions/proposalActions';

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Root'
>;

type Props = {
  navigation: ProfileScreenNavigationProp;
};

export default function AllProposalScreen({ navigation }: Props) {
  const dispatch = useDispatch();
  const wallet = useSelector((state:any) => state.wallet);
  // const [amount, setAmount] = React.useState('');
  const [id, setId] = React.useState('');

  // const contribute = async () => {
  //   dispatch(walletActions.contribute(web3.utils.toWei(amount, 'ether').toString())); 
  // }

  const getAllProposal = async () => {
    dispatch(proposalActions.getAllProposals());
  }

  const getProposal = async () => {
    dispatch(proposalActions.getProposal(id));
  }

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

        {/* <Text>{wallet.address}</Text> */}
        <Text>Welcome {wallet.phone}</Text>
        <Text style={styles.content}>You can use the `Create Proposal` Button to create a New Proposal</Text>

        {/* <TextInput
          style={{  borderColor: 'black', borderWidth: 1, backgroundColor: 'white' }}
          placeholder="input amount to contribute"
          onChangeText={setAmount}
          value={amount}
          />

        <Button
          title='Contribute'
          onPress={contribute}
          /> */}

        <Button
          title='Get All'
          onPress={getAllProposal}
          />

        <TextInput
          style={{  borderColor: 'black', borderWidth: 1, backgroundColor: 'white' }}
          placeholder="input proposal id"
          onChangeText={setId}
          value={id}
          />

        <Button
          title='Get Proposal'
          onPress={getProposal}
          />
       
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
  content: {
    padding: 10
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
