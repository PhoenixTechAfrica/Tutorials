import { FeeCurrency, requestAccountAddress, requestTxSig, waitForAccountAuth, waitForSignedTxs } from '@celo/dappkit';
import * as Linking from 'expo-linking';

import { contractInstance, kit, web3 } from '../../root';
import { alertActions } from './alertActions';
import { walletConstants } from '../../constants/walletConstants';

export const walletActions = {
  connect, contribute
}

function connect(params) {
  return async dispatch => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request("Connecting to wallet..."));

    const requestId = 'charlo_login';
    const dappName = 'Charlo';
    const callback = Linking.makeUrl('ProposalsPage');

    requestAccountAddress({
      requestId,
      dappName,
      callback
    });

    waitForAccountAuth(requestId)
      .then(res =>{
        kit.defaultAccount = res.address;
        dispatch(success(res));
        dispatch(alertActions.success("Connection successful"))
      })
      .catch(err => {
        dispatch(alertActions.error(err.toString()));
      });
  }

  function success(res) { return { type: walletConstants.CONNECT_SUCCESS, res } };
}

function contribute(amount) {
  return async dispatch => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request('Contribution initiated...'));

    try {
      const goldToken = await kit.contracts.getGoldToken();
      const contractAddress = await (await contractInstance).options.address
      const txObject = goldToken.transfer(contractAddress, web3.utils.toWei(amount, 'ether')).txo;

      const requestId = 'contribution';
      const dappName = 'Charlo';
      const callback = Linking.makeUrl('ProfilePage');

      requestTxSig(
        kit,
        [
          {
            tx: txObject,
            from: kit && kit.defaultAccount,
            to: goldToken.contract.options.address,
            feeCurrency: FeeCurrency.cUSD
          }
        ],
        { requestId, dappName, callback }
      );

      const response = await waitForSignedTxs(requestId);
      const rawTx = response.rawTxs[0];

      // Send the signed transaction via the kit
      const tx = await kit.connection.sendSignedTransaction(rawTx);
      const receipt = await tx.waitReceipt();

      dispatch(success(receipt));
      dispatch(alertActions.success("Contribution successful"))
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
    }
  };

  function success(res) { return { type: walletConstants.CONTRIBUTION_SUCCESS, res } };
}
