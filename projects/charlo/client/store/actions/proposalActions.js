import { FeeCurrency, requestTxSig, waitForSignedTxs } from '@celo/dappkit';
import { toTxResult } from '@celo/connect';
import * as Linking from 'expo-linking';

import { contractInstance, kit, web3 } from '../../root';
import { alertActions } from './alertActions';
import { proposalConstants } from '../../constants'


export const proposalActions = {
  create,
  getAllProposals,
  getProposal,
  voteOnProposal
}

function create(proposal) {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request("Create proposal initiated..."));
    dispatch(request());

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
      dispatch(failed());
    }
  };

  function request(message) { return { type: proposalConstants.CREATE_PROPOSAL_REQUEST }}
  function success(res) { return { type: proposalConstants.CREATE_PROPOSAL_SUCCESS, res } };
  function failed() { return { type: proposalConstants.CREATE_PROPOSAL_FAILED }}
}

function getAllProposals() {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request('Fetching all proposals...'));
    dispatch(request());

    try {
      const allProposals = await (await contractInstance).methods.getProposals().call();

      dispatch(success(allProposals));
      dispatch(alertActions.success("Fetch successful"));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
      dispatch(failed())
    }
  };

  function request() { return { type: proposalConstants.GET_ALL_PROPOSAL_REQUEST } };
  function success(proposals) { return { type: proposalConstants.GET_ALL_PROPOSAL_SUCCESS, proposals } };
  function failed() { return { type: proposalConstants.GET_ALL_PROPOSAL_FAILED } };
}

function getProposal(id) {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request(`Fetching proposal with id ${id}`));
    dispatch(request())

    try {
      const response = await (await contractInstance).methods.getProposal(id).call();

      const proposal = {
        id: response[0],
        amount: web3.utils.fromWei(response[1], 'ether'),
        livePeriod: response[2],
        for: response[3],
        against: response[4],
        description: response[5],
        votingPassed: response[6],
        paid: response[7],
        charityAddress: response[8],
        proposer: response[9],
        paidBy: response[10]
      }

      dispatch(success(proposal));
      dispatch(alertActions.success("Fetch successful"));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
      dispatch(failed());
    }
  };

  function request() { return { type: proposalConstants.GET_PROPOSAL_REQUEST } };
  function success(proposal) { return { type: proposalConstants.GET_PROPOSAL_SUCCESS, proposal } };
  function failed() { return { type: proposalConstants.GET_PROPOSAL_FAILED } };
}

function voteOnProposal(id, support) {
  return async (dispatch) => {
    dispatch(alertActions.clear());
    dispatch(alertActions.request("Voting initiated..."));
    dispatch(request());

    try {
      const contractAddress = await (await contractInstance).options.address;

      const requestId = 'vote_proposal';
      const dappName = 'Charlo';
      const callback = Linking.makeUrl('ProposalPage');

      const txObject = await (await contractInstance).methods.vote(id, support);

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
      dispatch(alertActions.success('Voted successful'));
    } catch (err) {
      dispatch(alertActions.error(err.toString()));
      dispatch(failed());
    }
  };

  function request() { return { type: proposalConstants.VOTE_PROPOSAL_REQUEST } };
  function success(res) { return { type: proposalConstants.VOTE_PROPOSAL_SUCCESS, res } };
  function failed() { return { type: proposalConstants.VOTE_PROPOSAL_FAILED } };
}
