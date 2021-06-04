import * as React from 'react';
import { View } from 'react-native';
import { Button, Card, Icon, Input, Layout, Modal, Text, useTheme, Spinner } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { proposalActions } from '../store/actions';
import { web3 } from '../root';


export const ViewProposalModal = ({setVisible, visible}) => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.proposal);
  const alert = useSelector(state => state.alert);

  const theme = useTheme();

  const cardHeader = (props) => {
    return(
      <View {...props} style={{...props.style, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{margin: 16}} category='h6'>Proposal</Text>
        <Button
          size='large'
          onPress={() => setVisible(false)}
          appearance='ghost'
          accessoryLeft={closeIcon}/>
      </View>
    );
  };

  const cardFooter = (props) => {
    return(
      <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'space-around', padding: 8}}>
        <Button
          style={{marginHorizontal: 2}}
          size='small'
          status='success'>
          UPVOTE
        </Button>
        <Button
          style={{marginHorizontal: 2}}
          size='small'
          status='warning'>
          DOWNVOTE
        </Button>
      </View>
    );
  };

  // const handleFor = () => {
  //   setProposal({...proposal, votesFor: ++proposal.votesFor});
  // };

  // const handleAgainst = () => {
  //   setProposal({...proposal, votesAgainst: ++proposal.votesAgainst});
  // };

  return(
    <Modal
      visible={visible}
      backdropStyle={{backgroundColor: theme['color-primary-transparent-300']}}
      onBackdropPress={() => setVisible(false)}>
      
      <Card
        disabled='true'
        style={{flex: 1, borderColor: theme['color-primary-default'], margin: 2}}
        header={cardHeader}
        footer={cardFooter}>
          
          {
            alert.loading ? <Spinner status='primary' size='giant' /> : 
            <>
            <Layout style={{flex: 1, width: 250}}>
              <Text style={{marginVertical: 8}}>Description: {store.proposal.description}</Text>
              <Text style={{marginVertical: 8}} category='p2'>Requested: {store.proposal.amount} Celo</Text>
              <Text style={{marginVertical: 8}} category='p2'>Proposer: {store.proposal.proposer}</Text>
              <Text style={{marginVertical: 8}} category='p2'>Charity: {store.proposal.charityAddress}</Text>
            </Layout>

            <Layout style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
              <Text style={{color: theme['color-success-default']}}>For: {store.proposal.for}</Text>
              <Text style={{color: theme['color-danger-default']}}>Against: {store.proposal.against}</Text>
            </Layout>
            </>
          }
        
          
      </Card>
    </Modal>
  );
};

const closeIcon = (props) => {
  return(
    <Icon {...props} name='close-circle-outline'/>
  );
}
