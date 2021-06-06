import * as React from 'react';
import { View } from 'react-native';
import { Button, Modal, Card, Layout, Input, Icon, useTheme, Text, Spinner } from '@ui-kitten/components';
import { useDispatch, useSelector } from 'react-redux';
import { proposalActions } from '../store/actions';

export const CreateProposalModal = ({setVisible, visible}) => {
  const dispatch = useDispatch();
  const store = useSelector(state => state.proposal);

  const theme = useTheme();

  const descriptionInput = useInputState('Description');
  const charityAddressInput = useInputState('Address');
  const amountInput = useInputState('Amount');

  const handleCreate = async () => {
    if (amountInput.value == ''
      || descriptionInput.value.length < 20
      || charityAddressInput.value == '') {

      return;
    }

    await dispatch(proposalActions.create({
      description: descriptionInput.value,
      charityAddress: charityAddressInput.value,
      amount: amountInput.value
    }));

    setVisible(false);

    amountInput.setValue('');
    descriptionInput.setValue('');
    charityAddressInput.setValue('');

    await dispatch(proposalActions.getAllProposals());
  };

  const cardHeader = (props) => {
    return(
      <View {...props} style={{...props.style, flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{margin: 16}} category='h6'>Create Proposal</Text>
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
      <View {...props} style={{...props.style, flexDirection: 'row', justifyContent: 'flex-end', padding: 8}}>
        <Button
          style={{marginHorizontal: 2}}
          size='small'
          status='basic'
          onPress={() => setVisible(false)}>
          CANCEL
        </Button>
        <Button
          style={{marginHorizontal: 2}}
          size='small'
          accessoryLeft={store.loadingNew ? loadingIndicator : ''}
          onPress={handleCreate}>
          CREATE
        </Button>
      </View>
    );
  };

  return(
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
        
        <Layout style={{flex: 1, padding: 8, width: 250}}>
          <Input
            size='medium'
            style={{marginVertical: 8}}
            keyboardType='numeric'
            placeholder='Enter amount in Celo'
            disabled={store.loadingNew}
            {...amountInput}/>

          <Input
            size='medium'
            style={{marginVertical: 8}}
            placeholder='Enter Charity address'
            disabled={store.loadingNew}
            {...charityAddressInput}/>

          <Input
            multiline={true}
            textStyle={{minHeight: 64}}
            style={{marginVertical: 8}}
            placeholder='Enter the description'
            keyboardType='default'
            disabled={store.loadingNew}
            {...descriptionInput}/>
        </Layout>
        
      </Card>
  </Modal>
  );
};

const useInputState = (name, initialValue = '') => {
  const [value, setValue] = React.useState(initialValue);

  let caption, status;
  if (value === '') {
    caption = `${name} cannot be empty`;

    if (name === 'Description' && value.length < 20) {
      caption = `${name} must be more than 20 characters`;
    }

    status = 'danger';
    
  } else status = 'success'

  return {value, onChangeText: setValue, caption, status, setValue};
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
