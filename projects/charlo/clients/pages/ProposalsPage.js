import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Layout, Button, Text, TopNavigation, Divider, Icon, Card } from '@ui-kitten/components';

// const StartIcon = (props) => {
//   return(<Icon {...props} name='star'/>)
// };

export const ProposalsPage = ({ navigation }) => {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Layout style={{flex: 1}}>
          <Card>
          <Button style={{margin: 8}}>Create Proposal</Button>
          </Card>
        </Layout>

        <Divider />
        <Layout style={{flex: 8}}>
          <Text>dcvjsjs</Text>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};
