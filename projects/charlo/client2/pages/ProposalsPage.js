import { Layout, Button, Text, TopNavigation, Divider } from '@ui-kitten/components';
import * as React from 'react';
import { View, SafeAreaView } from 'react-native';

export const ProposalsPage = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Layout
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 25,
              textAlign: 'center',
              marginBottom: 16,
            }}>
            This is the First Page under First Proposal
          </Text>
          <Button
            onPress={() => navigation.navigate('SecondPage')}
          >Go to Second Page</Button>
          <Button
            onPress={() => navigation.navigate('ThirdPage')}
          >Go to Third Page</Button>
        </Layout>
        <Text style={{ fontSize: 18, textAlign: 'center' }}>
          Custom React Navigate Drawer
        </Text>
        <Text style={{ fontSize: 16, textAlign: 'center', }}>
          www.aboutreact.com
        </Text>
      </Layout>
    </SafeAreaView>
  );
};
