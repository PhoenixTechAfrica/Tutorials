import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Button, Card, Input, Layout, List, useTheme, Text, Spinner } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { ViewProposalModal } from '../components';
import { walletActions, proposalActions } from '../store/actions';
import { contractInstance, kit } from '../root';

export const ProfilePage = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [votes, setVotes] = React.useState([]);

  const dispatch = useDispatch();
  const wallet = useSelector(state => state.wallet);
  const store = useSelector(state => state.proposal);

  const amountInput = useInputState('Amount');

  const theme = useTheme();

  const contribute = async () => {
    const contributed = amountInput.value;
    if (contributed === '') {
      return;
    }

    await dispatch(walletActions.contribute(contributed));

    await dispatch(walletActions.grantRole(contributed));

    await dispatch(walletActions.getRole());

    amountInput.setValue('');
  };

  React.useEffect(() => {
    dispatch(walletActions.getVotes());
  }, []);

  React.useEffect(() => {
    getVotes();
  }, [wallet.votes.length]);

  const getVotes = () => {
    const stakeholderVotes = store.proposals.filter(
      function(e) {
        return this.indexOf(e[0]) >= 0;
      },
      wallet.votes
    );
    
    setVotes(stakeholderVotes);
  };

  const cardItem = (info) => {
    return(
      <Card
        style={{borderColor: theme['color-primary-default'], marginVertical: 4}}
        footer={props => cardFooter(props, {for: info.item[3], against: info.item[4]})}
        onPress={() => getProposal(info.item[0])}>
        
        <Text category='s2' numberOfLines={4} ellipsizeMode='tail'>{info.item[5]}</Text>
      </Card>
    );
  };

  const getProposal = (id) => {
    dispatch(proposalActions.getProposal(id));

    setVisible(true);
  };
  
  const cardFooter = (props, info) => {
    return(
      <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'space-evenly', padding: 8}}>
        <Text style={{color: theme['color-info-default']}}>For: {info.for}</Text>
        <Text style={{color: theme['color-danger-default']}}>Against: {info.against}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, alignItems: 'center', padding: 16 }}>
        <Card style={{flexDirection: 'column', justifyContent: 'space-between', borderColor: theme['color-basic-800']}}>
          <Input
            style={{marginVertical: 8}}
            size='medium'
            status='primary'
            keyboardType='numeric'
            placeholder='Enter amount to contribute'
            {...amountInput}/>
          
          <Button
            size='small'
            onPress={contribute}
            accessoryLeft={wallet.loading ? loadingIndicator : ''}
            >
            CONTRIBUTE
          </Button>
        </Card>

        {
          wallet.loading ? <Spinner status='primary' size='giant' /> : null
        }

        <Layout style={{flex: 5}}>
          {
            wallet.loading ?
            <Text>The list of proposal voted on is empty</Text> :
            <List
            style={{backgroundColor: theme['color-basic-800']}}
            contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 4}}
            data={votes}
            renderItem={cardItem}/>
          }
        </Layout>

        <ViewProposalModal
          setVisible={setVisible}
          visible={visible}/>
      </Layout>
    </SafeAreaView>
  );
};

const useInputState = (name, initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);

  let caption;
  if (value === '') {
    caption = `${name} must not be empty`;
  }

  return {value, onChangeText: setValue, setValue, caption};
};

const loadingIndicator = (props) => {
  return(
    <View style={{...props.style, justifyContent: 'center', alignItems: 'center'}}>
      <Spinner size='small' status='basic' />
    </View>
  );
}
