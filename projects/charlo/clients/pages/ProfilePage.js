import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Button, Card, Input, Layout, List, useTheme, Text } from '@ui-kitten/components';
import { ViewProposalModal } from '../components/ViewProposalModal';

export const ProfilePage = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const amountInput = useInputState('Amount');

  const theme = useTheme();

  const contribute = () => {
    if (amountInput.value === '') {
      return;
    }

    amountInput.setValue('');
  };

  const data = new Array(8).fill({
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum itaque nesciunt hic nisi? Repellendus laboriosam, fugiat cupiditate vitae qui distinctio quas numquam quidem, ipsa quos vel eligendi veniam magni dolores!'
  })

  const cardItem = (info) => {
    return(
      <Card
        style={{borderColor: theme['color-primary-default'], marginVertical: 4}}
        footer={props => cardFooter(props, {for: 10, against: 3})}
        onPress={() => setVisible(true)}>
        
        <Text category='s2' numberOfLines={4} ellipsizeMode='tail'>{info.item.desc}</Text>
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Layout style={{ flex: 1, padding: 8 }}>
        <Card style={{flexDirection: 'column', justifyContent: 'space-between', borderColor: theme['color-primary-default']}}>
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
            >
            CONTRIBUTE
          </Button>
        </Card>

        <Layout style={{flex: 5}}>
          <List pagingEnabled='true'
            contentContainerStyle={{paddingHorizontal: 8, paddingVertical: 4}}
            data={data}
            renderItem={cardItem}/>
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
