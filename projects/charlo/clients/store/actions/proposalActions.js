import { FeeCurrency, requestTxSig, waitForSignedTxs } from '@celo/dappkit';
import { toTxResult } from '@celo/connect';
import * as Linking from 'expo-linking';

import { contractInstance, kit } from '../../root';
import { alertActions } from './alertActions';


export const proposalActions = {
  createProposal,
  getAllProposals,
  getProposal
}

function createProposal(proposal) {
  return async dispatch => {
    dispatch(request('Sending transaction...'));

    try {
      const contractAddress = await (await contractInstance).options.address;

      const requestId = 'create_proposal';
      const dappName = 'Charlo';
      const callback = Linking.makeUrl('ProposalsPage');

      const txObject = await (await contractInstance).methods.createProposal(
        proposal.description,
        proposal.charityAddress,
        proposal.amount
      );

      requestTxSig(
        kit.
        [
          {
            from: kit && kit.defaultAccount,
            to: contractAddress,
            tx: txObject,
            feeCurrency: FeeCurrency.cGLD
          }
        ],
        { requestId, dappName, callback }
      );

      const response = await waitForSignedTxs(requestId);
      const tx = response.rawTxs[0];
      const result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();

      dispatch(success(result));
    } catch (err) {
      dispatch(failure(err.toString()));
      dispatch(alertActions.error(error.toString()));
    }
  };

  function request(message: string) { return { type: proposalConstants.CREATE_PROPOSAL_REQUEST, message } };
  function success(res: object) { return { type: proposalConstants.CREATE_PROPOSAL_SUCCESS, res } };
  function failure(error: any) { return { type: proposalConstants.CREATE_PROPOSAL_FAILURE, error } };
}

function getAllProposals() {
  return async dispatch => {
    dispatch(request('Fetching all proposals...'));

    try {
      const allProposals = await (await contractInstance).methods.getProposals().call();

      dispatch(success(allProposals));
    } catch (err) {
      dispatch(failure(err));
      dispatch(alertActions.error(err.toString()));
    }
  };

  function request(message: string) { return { type: proposalConstants.GET_ALL_PROPOSAL_REQUEST, message } };
  function success(res: Proposal[]) { return { type: proposalConstants.GET_ALL_PROPOSAL_SUCCESS, res } };
  function failure(error: any) { return { type: proposalConstants.GET_ALL_PROPOSAL_FAILURE, error } };
}

function getProposal(id) {
  return async dispatch => {
    dispatch(request(`Fetching proposal with id ${id}`));

    try {
      const proposal = await (await contractInstance).methods.getProposal(id).call();
      dispatch(success(proposal));
    } catch (err) {
      dispatch(failure(err));
      dispatch(alertActions.error(err.toString()));
    }
  };

  function request(message: string) { return { type: proposalConstants.GET_PROPOSAL_REQUEST, message } };
  function success(proposal: Proposal) { return { type: proposalConstants.GET_PROPOSAL_SUCCESS, proposal } };
  function failure(error: any) { return { type: proposalConstants.GET_PROPOSAL_FAILURE, error } };
}
