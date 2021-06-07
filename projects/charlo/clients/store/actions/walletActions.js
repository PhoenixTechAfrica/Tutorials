import { FeeCurrency, requestAccountAddress, requestTxSig, waitForAccountAuth, waitForSignedTxs } from '@celo/dappkit';
import { toTxResult } from '@celo/connect';
import * as Linking from 'expo-linking';

import { contractInstance, kit, web3 } from '../../root';
import { alertActions } from './alertActions';
import { walletConstants } from '../../constants/walletConstants';


export const walletActions = {
  connect,
  contribute,
  grantRole,
  getRole
}

function connect(params) {
  return async (dispatch )=> {
    dispatch(alertActions.clear());
    dispatch(alertActions.request("Connecting to wallet..."));
    dispatch(request())

    try {
      const requestId = 'charlo_login';
      const dappName = 'Charlo';
      const callback = Linking.makeUrl('ProposalsPage');

      requestAccountAddress({
        requestId,
        dappName,
        callback
      });

      const response = await waitForAccountAuth(requestId);

      kit.defaultAccount = response.address;
      dispatch(success(response));
      dispatch(alertActions.success("Connection successful"))
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
        dispatch(failed());
    }
  }

  function request() { return { type: walletConstants.CONNECT_REQUEST} };
  function success(res) { return { type: walletConstants.CONNECT_SUCCESS, res } };
  function failed() { return { type: walletConstants.CONNECT_FAILED } };
}

function contribute(amount) {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request('Contribution initiated...'));
    dispatch(request());

    try {
      const goldToken = await kit.contracts.getGoldToken();
      const contractAddress = await (await contractInstance).options.address
      const requestedAmount = web3.utils.toWei(amount, 'ether');
      const txObject = goldToken.transfer(contractAddress, requestedAmount).txo;

      const requestId = 'contribution';
      const dappName = 'Charlo';
      const callback = Linking.makeUrl('ProfilePage');

      requestTxSig(
        kit,
        [
          {
            tx: txObject,
            from: kit.defaultAccount,
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
      dispatch(alertActions.success("Contribution successful"));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
      dispatch(failed());
    }
  };

  function request() { return { type: walletConstants.CONTRIBUTION_REQUEST } };
  function success(res) { return { type: walletConstants.CONTRIBUTION_SUCCESS, res } };
  function failed() { return { type: walletConstants.CONTRIBUTION_FAILED } };
}

function grantRole(amount) {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request('Checking for role assignment'));
    dispatch(request());

    try {
      const contractAddress = await (await contractInstance).options.address;
  
      const requestId = 'check_role';
      const dappName = 'Charlo';
      const callback = Linking.makeUrl('ProfilePage');
  
      const txObject = await (await contractInstance).methods.makeStakeholder(web3.utils.toWei(amount, 'ether'));
  
      requestTxSig(
        kit,
        [
          {
            from: kit.defaultAccount,
            to: contractAddress,
            tx: txObject,
            feeCurrency: FeeCurrency.cUSD
          }
        ],
        {requestId, dappName, callback}
      );

      const response = await waitForSignedTxs(requestId);
      const rawTx = response.rawTxs[0];
      const result = await toTxResult(kit.web3.eth.sendSignedTransaction(rawTx)).waitReceipt();

      dispatch(success(result));
      dispatch(alertActions.success('Role assignment successful'));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
      dispatch(failed());
    }
  };

  function request() { return { type: walletConstants.ROLE_REQUEST } };
  function success(res) { return { type: walletConstants.ROLE_SUCCESS, res } };
  function failed() { return { type: walletConstants.ROLE_FAILED } };
}

function getRole() {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request("Fetching role..."));
    dispatch(request());

    try {
      const account = kit.defaultAccount;
      let isStakeholder = await (await contractInstance).methods.isStakeholder().call({from: account});

      let isContributor = false;
      let contributed = "0";

      if (isStakeholder) {
        contributed = await (await contractInstance).methods.getStakeholderBalance().call({from: account});
      } else {
        isContributor = await (await contractInstance).methods.isContributor().call({from: account});

        if (isContributor) {
          contributed = await (await contractInstance).methods.getContributorBalance().call({from: account});
        }
      }

      dispatch(success({
        isStakeholder,
        isContributor: isStakeholder ? isStakeholder : isContributor,
        contributed: web3.utils.fromWei(contributed, 'ether')
      }));
      dispatch(alertActions.success("Role fetch successful"));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
      dispatch(failed())
    }
  }

  function request() { return { type: walletConstants.ROLE_CHECK_REQUEST}};
  function success(role) { return { type: walletConstants.ROLE_CHECK_SUCCESS, role}};
  function failed() { return { type: walletConstants.ROLE_CHECK_FAILED}};
}
