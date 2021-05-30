import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, Button } from 'react-native';
import { Proposal, RootStackParamList } from '../types';
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

export default function CreateProposalScreen({ navigation }: Props) {
  // const alert = useSelector(state => state.alert)
  const dispatch = useDispatch();
  const wallet = useSelector((state:any) => state.wallet);
  const [amount, setAmount] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [chaAdd, setChaAdd] = React.useState('');
  const [id, setId] = React.useState('');

  const createProposal = async () => {
    const proposal: Proposal = {
      amount: amount,
      charityAddress: chaAdd,
      description: desc
    };
    dispatch(proposalActions.createProposal(proposal)); 
  }

  React.useEffect(() => {
    if (!kit.defaultAccount) {
      navigation.navigate("Root");
    }
  });

  return (
    <View style={styles.container}>
      <Text>
        Create A Proposal
        </Text>

      {/* <TextInput
        style={styles.input}
        // onChangeText={onChangeText}
        // value={text}
      /> */}
   <TextInput
        style={styles.input}
        onChangeText={setDesc}
        value={desc}
        placeholder="Enter the description"
        keyboardType="default"
      />
       <TextInput
        style={styles.input}
        onChangeText={setChaAdd}
        value={chaAdd}
        placeholder="Enter Charity Address"
        keyboardType="default"
      />

      <TextInput
        style={styles.input}
        onChangeText={setAmount}
        value={amount}
        placeholder="Enter the amount"
        keyboardType="numeric"
      />

      <Button
          title='Create Proposal'
          onPress={createProposal}
          />
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
  input: {
    height: 40,
    width: '60%',
    padding: 10,
    margin: 12,
    borderWidth: 1,
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
