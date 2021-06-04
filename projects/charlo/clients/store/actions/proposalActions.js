import { FeeCurrency, requestTxSig, waitForSignedTxs } from '@celo/dappkit';
import { toTxResult } from '@celo/connect';
import * as Linking from 'expo-linking';

import { contractInstance, kit, web3 } from '../../root';
import { alertActions } from './alertActions';
import { proposalConstants } from '../../constants'


export const proposalActions = {
  create,
  getAllProposals,
  getProposal
}

function create(proposal) {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request("Create proposal initiated..."));

    try {
      const contractAddress = await (await contractInstance).options.address;

      const requestId = 'create_proposal';
      const dappName = 'Charlo';
      const callback = Linking.makeUrl('ProposalsPage');

      const description = proposal.description;
      const charityAddress = proposal.charityAddress;
      const requestedAmount = web3.utils.toWei(proposal.amount, 'ether');

      const txObject = await (await contractInstance).methods.createProposal(description, charityAddress, requestedAmount);

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
        { requestId, dappName, callback }
      );

      const response = await waitForSignedTxs(requestId);
      const rawTx = response.rawTxs[0];
      const result = await toTxResult(kit.web3.eth.sendSignedTransaction(rawTx)).waitReceipt();
      
      dispatch(success(result));
      dispatch(alertActions.success("Proposal successful"));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
    }
  };

  function success(res) { return { type: proposalConstants.CREATE_PROPOSAL_SUCCESS, res } };
}

function getAllProposals() {
  return async dispatch => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request('Fetching all proposals...'));

    try {
      const allProposals = await (await contractInstance).methods.getProposals().call();

      dispatch(success(allProposals));
      dispatch(alertActions.success("Fetch successful"));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
    }
  };

  function success(proposals) { return { type: proposalConstants.GET_ALL_PROPOSAL_SUCCESS, proposals } };
}

function getProposal(id) {
  return async dispatch => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request(`Fetching proposal with id ${id}`));

    try {
      const proposal = await (await contractInstance).methods.getProposal(id).call();

      dispatch(success(proposal));
      dispatch(alertActions.success("Fetch successful"));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
    }
  };

  function success(proposal) { return { type: proposalConstants.GET_PROPOSAL_SUCCESS, proposal } };
}
