import * as React from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Layout, Button, Text, TopNavigation, Divider, Icon, Card, useTheme, Modal, Input, List, Spinner } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';

import { CreateProposalModal, ViewProposalModal } from '../components';
import { proposalActions } from '../store/actions';
import { kit } from '../root';

export const ProposalsPage = ({ navigation }) => {
  const [createVisible, setCreateVisible] = React.useState(false);
  const [viewVisible, setViewVisible] = React.useState(false);

  const dispatch = useDispatch();
  const store = useSelector(state => state.proposal);
  const wallet = useSelector(state => state.wallet);

  const theme = useTheme();

  React.useEffect(() => {
    if (!kit.defaultAccount) {
      navigation.navigate("WelcomePage");
    }
  });

  React.useEffect(() => {
    dispatch(proposalActions.getAllProposals());
  }, []);

  const chaFooter = (props, info) => {
    return(
      <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'space-evenly', padding: 8}}>
        <Text style={{color: theme['color-info-default']}}>For: {info.for}</Text>
        <Text style={{color: theme['color-danger-default']}}>Against: {info.against}</Text>
      </View>
    );
  };

  const cardItem = (info) => {
    return(
      <Card
        style={{borderColor: theme['color-primary-default'], marginVertical: 4}}
        footer={props => chaFooter(props, {for: info.item[3], against: info.item[4]})}
        onPress={() => getProposal(info.item[0])}>
        
        <Text category='s2' numberOfLines={4} ellipsizeMode='tail'>{info.item[5]}</Text>
      </Card>
    );
  };

  const getProposal = (id) => {
    dispatch(proposalActions.getProposal(id));

    setViewVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, alignItems: 'center', padding: 16 }}>

        {
          wallet.isStakeholder ?
          <Button
            size='medium'
            style={{marginVertical: 8}}
            onPress={() => setCreateVisible(true)}
          >Create Proposal</Button> : null
        }

        {
          store.loadingAll ? <Spinner status='primary' size='giant' /> : 
          store.proposals.length !== 0 ?
          <List
          style={{backgroundColor: theme['color-basic-800']}}
          contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 4}}
          data={store.proposals}
          renderItem={cardItem}/> : <Text>The list of proposal is empty</Text>
        }

        <CreateProposalModal
          setVisible={setCreateVisible}
          visible={createVisible}/>

        <ViewProposalModal
          setVisible={setViewVisible}
          visible={viewVisible}/>

      </Layout>
    </SafeAreaView>
  );
};

const loadingIndicator = (props) => {
  return(
    <View style={{...props.style, justifyContent: 'center', alignItems: 'center'}}>
      <Spinner size='small' status='basic' />
    </View>
  );
}
