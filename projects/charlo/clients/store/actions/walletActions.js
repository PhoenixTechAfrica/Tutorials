import { FeeCurrency, requestAccountAddress, requestTxSig, waitForAccountAuth, waitForSignedTxs } from '@celo/dappkit';
import * as Linking from 'expo-linking';

import { contractInstance, kit } from '../../root';
import { alertActions } from './alertActions';
import { walletConstants } from '../../constants/walletConstants';

export const walletActions = {
  connect
}

function connect(params) {
  return async dispatch => {
    dispatch(request("Connecting to wallet..."));

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
      })
      .catch(err => {
        dispatch(failure(err));
        dispatch(alertActions.error(err.toString()));
      });
  }

  function request(message: string) { return { type: walletConstants.CONNECT_REQUEST, message } };
  function success(res: object) { return { type: walletConstants.CONNECT_SUCCESS, res } };
  function failure(error: any) { return { type: walletConstants.CONNECT_FAILURE, error } };
}

function contribute(amount) {
  return async dispatch => {
    dispatch(request('Contribution initiated...'));

    try {
      const goldToken = await kit.contracts.getGoldToken();
      const contractAddress = await (await contractInstance).options.address
      const txObject = goldToken.transfer(contractAddress, amount).txo;

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
            feeCurrency: FeeCurrency.cGLD
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
    } catch (err) {
      dispatch(failure(err.toString()));
      dispatch(alertActions.error(err.toString()));
    }
  };

  function request(message: string) { return { type: walletConstants.CONTRIBUTION_REQUEST, message } };
  function success(res: object) { return { type: walletConstants.CONTRIBUTION_SUCCESS, res } };
  function failure(error: any) { return { type: walletConstants.CONTRIBUTION_FAILURE, error } };
}
