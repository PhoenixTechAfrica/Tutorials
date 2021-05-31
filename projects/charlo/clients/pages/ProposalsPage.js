import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Layout, Button, Text, TopNavigation, Divider, Icon, Card, useTheme, Modal, Input } from '@ui-kitten/components';

const useInputState = (initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);
  return {value, onChangeText: setValue};
};

export const ProposalsPage = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();
  const descriptionInput = useInputState();
  const charityAddressInput = useInputState();
  const amountInput = useInputState();

  const cardHeader = (props) => {
    return(
      <View {...props} style={{...props.style, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{margin: 16}} category='h6'>Create Proposal</Text>
        <Button
          size='large'
          onPress={() => setVisible(false)}
          appearance='ghost'
          accessoryLeft={starIcon}/>
          
      </View>
    );
  };

  const cardFooter = (props) => {
    return(
      <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'flex-end'}}>
        <Button
          style={{marginHorizontal: 2}}
          size='small'
          status='basic'
          onPress={() => setVisible(false)}>
          CANCEL
        </Button>
        <Button
          style={{marginHorizontal: 2}}
          size='small'>
          CREATE
        </Button>
      </View>
    );
  };

  const starIcon = (props) => {
    return(
      <Icon {...props} name='close-circle-outline'/>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 16 }}>
        <Card
          disabled='true'
          style={{borderColor: theme['color-primary-default'], margin: 8, padding: 8}}>

          <Button size='medium' onPress={() => setVisible(true)}>Create Proposal</Button>
          
        </Card>

        <Modal
          visible={visible}
          backdropStyle={{backgroundColor: theme['color-primary-transparent-300']}}
          onBackdropPress={() => setVisible(false)}
          >
            <Card
              disabled='true'
              style={{flex: 1, borderColor: theme['color-primary-default'], margin: 2}}
              header={cardHeader}
              footer={cardFooter}>
              
              <Layout style={{flex: 1, padding: 8}}>
              <Input
                  size='medium'
                  style={{margin: 2}}
                  status='primary'
                  keyboardType='numeric'
                  placeholder='Enter amount'
                  {...amountInput}/>

                <Input
                  size='medium'
                  style={{margin: 2}}
                  status='primary'
                  placeholder='Enter Charity address'
                  {...charityAddressInput}/>

                <Input
                  multiline={true}
                  textStyle={{minHeight: 64}}
                  style={{margin: 2}}
                  status='primary'
                  placeholder='Enter the description'
                  {...descriptionInput}/>
              </Layout>
              
            </Card>
        </Modal>
      </Layout>
    </SafeAreaView>
  );
};
