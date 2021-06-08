import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Button, Card, Input, Layout, List, useTheme, Text, Spinner, ViewPager, Icon } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { ViewProposalModal } from '../components';
import { profileActions, proposalActions } from '../store/actions';
import { contractInstance, kit } from '../root';

export const ProfilePage = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [paidVotes, setPaidVotes] = React.useState([]);
  const [payableVotes, setPayableVotes] = React.useState([]);
  const [inVotingVotes, setInVotingVotes] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const dispatch = useDispatch();
  const profile = useSelector(state => state.profile);
  const store = useSelector(state => state.proposal);

  const amountInput = useInputState('Amount');

  const theme = useTheme();

  const contribute = async () => {
    const contributed = amountInput.value;
    if (contributed === '') {
      return;
    }

    await dispatch(profileActions.contribute(contributed));

    await dispatch(profileActions.grantRole(contributed));

    await dispatch(profileActions.getRole());

    amountInput.setValue('');
  };

  React.useEffect(() => {
    dispatch(profileActions.getVotes());
  }, []);

  React.useEffect(() => {
    getVotes();
  }, [profile.votes.length]);

  const getVotes = () => {
    const today = new Date().getTime() / 1000;
    const stakeholderVotes = store.proposals.filter(
      function(e) {
        return this.indexOf(e[0]) >= 0;
      },
      profile.votes
    );

    const stakePaidVotes = stakeholderVotes.filter(
      (element) => element[7] == true
    );

    const stakePayable = stakeholderVotes.filter(
      (element) => (element[2] <= today && element[7] == false)
    );

    const stakeInVoting = stakeholderVotes.filter(
      (element) => (element[2] > today && element[7] == false)
    );
    
    setPaidVotes(stakePaidVotes);
    setPayableVotes(stakePayable);
    setInVotingVotes(stakeInVoting);
  };

  const getProposal = (id) => {
    if (store.proposal.id == id) {
      setVisible(true);

      return;
    }

    dispatch(proposalActions.getProposal(id));

    setVisible(true);
  };

  const shouldLoadComponent = (index) => index == selectedIndex;
    
  const handleRightClick = () => {
    if (selectedIndex < 2) {
      setSelectedIndex(selectedIndex + 1);
    }
  };
  const handleLeftClick = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
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
  
  const cardFooter = (props, info) => {
    return(
      <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'space-evenly', padding: 8}}>
        <Text style={{color: theme['color-info-default']}}>For: {info.for}</Text>
        <Text style={{color: theme['color-danger-default']}}>Against: {info.against}</Text>
      </View>
    );
  };

  const page = () => {
    return(
      <>
        <Layout style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Button
            appearance='ghost'
            status='info'
            accessoryLeft={leftIcon}
            onPress={handleLeftClick}
            />
          <Text style={{alignSelf: 'center', marginVertical: 16}}>{selectedIndex == 0 ? 'In Voting' : selectedIndex == 1 ? 'Payable Proposals' : 'Paid Proposals'}</Text>
          <Button
            appearance='ghost'
            status='info'
            accessoryRight={rightIcon}
            onPress={handleRightClick}
            />
        </Layout>
        {
          (profile.loading || !profile.isStakeholder) ?
          <Text style={{backgroundColor: theme['color-basic-800']}}>{selectedIndex == 0 ? 'The list of "in voting" proposal is empty' : selectedIndex == 1 ? 'The list of "payable" proposal is empty' : 'The list of "paid" proposal is empty'}</Text> :
          <List
          style={{backgroundColor: theme['color-basic-800']}}
          contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 4}}
          data={selectedIndex == 0 ? inVotingVotes : selectedIndex == 1 ? payableVotes : paidVotes}
          renderItem={cardItem}/>
        }
      </>
    );
  };

  const rightIcon = (props) => {
    if (selectedIndex != 2) {
      return(
        <Icon
          {...props}
          name='arrowhead-right-outline'/>
      );
    }

    return(null);
  };

  const leftIcon = (props) => {
    if (selectedIndex != 0) {
      return(
        <Icon
          {...props}
          name='arrowhead-left-outline'/>
      );
    }
    
    return(null);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
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
            accessoryLeft={profile.loading ? loadingIndicator : ''}
            >
            CONTRIBUTE
          </Button>
        </Card>

        <ViewPager style={{height: 480}}
          selectedIndex={selectedIndex}
          shouldLoadComponent={shouldLoadComponent}
          onSelect={setSelectedIndex}>

            <Layout level='2'>
              {page()}
            </Layout>

            <Layout level='2'>
              {page()}
            </Layout>

            <Layout level='2'>
              {page()}
            </Layout>
          </ViewPager>

        <ViewProposalModal
          setVisible={setVisible}
          visible={visible}
          isPofile='true'/>
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
