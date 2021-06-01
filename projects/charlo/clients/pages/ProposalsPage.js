import * as React from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Layout, Button, Text, TopNavigation, Divider, Icon, Card, useTheme, Modal, Input, List } from '@ui-kitten/components';

import { CreateProposalModal, ViewProposalModal } from '../components';

export const ProposalsPage = ({ navigation }) => {
  const [createVisible, setCreateVisible] = React.useState(false);
  const [viewVisible, setViewVisible] = React.useState(false);
  const [data, setData] = React.useState([]);
  const theme = useTheme();

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
        footer={props => chaFooter(props, {for: 10, against: 3})}
        onPress={() => setViewVisible(true)}>
        
        <Text category='s2' numberOfLines={4} ellipsizeMode='tail'>{info.item.desc}</Text>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Card
          disabled='true'
          style={{borderColor: theme['color-primary-default'], margin: 8, padding: 8}}>

          <Button size='medium' onPress={() => setCreateVisible(true)}>Create Proposal</Button>
        </Card>

        <List
          contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 4}}
          data={data}
          renderItem={cardItem}/>

        <CreateProposalModal
          setVisible={setCreateVisible}
          visible={createVisible}
          setData={setData}
          data={data}/>

        <ViewProposalModal
          setVisible={setViewVisible}
          visible={viewVisible}/>

      </Layout>
    </SafeAreaView>
  );
};
