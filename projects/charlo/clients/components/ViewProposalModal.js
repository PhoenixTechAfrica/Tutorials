import * as React from 'react';
import { View } from 'react-native';
import { Button, Card, Icon, Input, Layout, Modal, Text, useTheme, Spinner } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';

import { proposalActions, profileActions } from '../store/actions';


export const ViewProposalModal = ({setVisible, visible, isProfile}) => {
  const store = useSelector(state => state.proposal);
  const profile = useSelector(state => state.profile);

  const dispatch = useDispatch();

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
    if (!store.loadingOne) {
      if (isProfile == "false") {
        if (profile.isStakeholder) {
          return(
            <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'space-around', padding: 8}}>
              <Button
                style={{marginHorizontal: 2}}
                size='small'
                status='success'
                accessoryLeft={store.loadingVote ? loadingIndicator : ''}
                onPress={handleFor}>
                UPVOTE
              </Button>
              <Button
                style={{marginHorizontal: 2}}
                size='small'
                status='warning'
                accessoryLeft={store.loadingVote ? loadingIndicator : ''}
                onPress={handleAgainst}>
                DOWNVOTE
              </Button>
            </View>
          );
        } else {
          return(null);
        }
      } else {  
        if (store.proposal.paid) {
          return(
            <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'center', padding: 8}}>
              <Text style={{width: 200}}>This proposal has been paid by {store.proposal.paidBy}</Text>
            </View>
          );
        }

        const livePeriod = new Date(store.proposal.livePeriod * 1000);
        const today = new Date() / 1000;
        if (today > livePeriod) {
          if (store.proposal.for <= store.proposal.against) {
            return(
              <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'center', padding: 8}}>
                <Text style={{width: 200}}>Proposal does not have enough support</Text>
              </View>
            );
          }

          if (profile.daoBalance >= store.proposal.amount) {
            return(
              <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'center', padding: 8}}>
                <Button
                  size='small'
                  status='primary'
                  accessoryLeft={profile.loadingPay ? loadingIndicator : ''}
                  onPress={handlePay}>
                    Pay
                  </Button>
              </View>
            );
          } else {
            return(
              <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'center', padding: 8}}>
                <Text style={{width: 200}}>There's not enough balance to pay this charity</Text>
              </View>
            );
          }
          
        } else {
          return(
            <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'center', padding: 8}}>
              <Text style={{width: 200}}>This proposal is still in it's voting period</Text>
            </View>
          );
        }
      }
    } else {
      return(null);
    }
  };

  const handleFor = async () => {
    await dispatch(proposalActions.voteOnProposal(store.proposal.id, true));

    setVisible(false);

    await dispatch(proposalActions.getAllProposals());
    await dispatch(profileActions.getVotes());
  };

  const handleAgainst = async () => {
    await dispatch(proposalActions.voteOnProposal(store.proposal.id, false));

    setVisible(false);

    await dispatch(proposalActions.getAllProposals());
    await dispatch(profileActions.getVotes());
  };

  const handlePay = async () => {
    await dispatch(profileActions.payCharity(store.proposal));

    setVisible(false);

    await dispatch(proposalActions.getAllProposals());
  };

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
            store.loadingOne ? 
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Spinner status='primary' size='giant' />
            </View>
            : 
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
};

const loadingIndicator = (props) => {
  return(
    <View style={{...props.style, justifyContent: 'center', alignItems: 'center'}}>
      <Spinner size='small' status='basic' />
    </View>
  );
}
