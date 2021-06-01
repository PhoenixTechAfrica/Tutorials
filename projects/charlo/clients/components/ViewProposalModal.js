import * as React from 'react';
import { View } from 'react-native';
import { Button, Card, Icon, Input, Layout, Modal, Text, useTheme } from '@ui-kitten/components';

const closeIcon = (props) => {
  return(
    <Icon {...props} name='close-circle-outline'/>
  );
}

export const ViewProposalModal = ({setVisible, visible}) => {
  const [proposal, setProposal] = React.useState({
    id: 1,
    address: '0xgcj6t3gducgytacg76gbcuyg67gcbuyg7w',
    requester: '0xkh7uwbc8y8uihcbwb88nc8wych28q7yh',
    amount: 200,
    description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea, ipsa voluptatibus fugit dolore iure corporis esse praesentium nulla, ipsam, repudiandae suscipit itaque amet. A maiores minima commodi, optio adipisci aut!',
    votesFor: 20,
    votesAgainst: 3
  })

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
          status='success'
          onPress={handleFor}>
          UPVOTE
        </Button>
        <Button
          style={{marginHorizontal: 2}}
          size='small'
          status='warning'
          onPress={handleAgainst}>
          DOWNVOTE
        </Button>
      </View>
    );
  };

  const handleFor = () => {
    setProposal({...proposal, votesFor: ++proposal.votesFor});
  };

  const handleAgainst = () => {
    setProposal({...proposal, votesAgainst: ++proposal.votesAgainst});
  };

  return(
    <Modal
      visible={visible}
      backdropStyle={{backgroundColor: theme['colo-primary-transparent-300']}}
      onBackdropPress={() => setVisible(false)}>
      
      <Card
        disabled='true'
        style={{flex: 1, borderColor: theme['colo-primary-default'], margin: 2}}
        header={cardHeader}
        footer={cardFooter}>
        
        <Layout style={{flex: 1, padding: 8, width: 250}}>
          <Text style={{marginVertical: 8}}>Requester: {proposal.requester}</Text>
          <Text style={{marginVertical: 8}}>Charity: {proposal.address}</Text>
          <Text style={{marginVertical: 8}}>Description: {proposal.description}</Text>
        </Layout>

        <Layout style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text style={{color: theme['color-success-default']}}>For: {proposal.votesFor}</Text>
          <Text style={{color: theme['color-danger-default']}}>Against: {proposal.votesAgainst}</Text>
        </Layout>
      </Card>
    </Modal>
  );
};
