import BigNumber from 'bignumber.js';
import { web3 } from '../../root';
import { proposalConstants } from '../../constants/proposalConstants';

const initialState = {
  proposals: [],
  proposal: {},
  txHash: '',
  loadingAll: false,
  loadingOne: false,
  loadingNew: false
};

export function proposal(state = initialState, action) {
  switch (action.type) {
    case proposalConstants.CREATE_PROPOSAL_REQUEST:
      return {
        ...state,
        loadingNew: true
      };
    case proposalConstants.GET_ALL_PROPOSAL_REQUEST:
      return {
        ...state,
        loadingAll: true
      };
    case proposalConstants.GET_PROPOSAL_REQUEST:
      return {
        ...state,
        loadingOne: true
      };
    case proposalConstants.CREATE_PROPOSAL_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        loadingNew: false
      };
    case proposalConstants.GET_ALL_PROPOSAL_SUCCESS:
      return {
        ...state,
        proposals: action.proposals,
        loadingAll: false,
      };
    case proposalConstants.GET_PROPOSAL_SUCCESS:
      return {
        ...state,
        proposal: {
          id: action.proposal[0],
          amount: web3.utils.fromWei(action.proposal[1], 'ether'),
          livePeriod: action.proposal[2],
          for: action.proposal[3],
          against: action.proposal[4],
          description: action.proposal[5],
          votingPassed: action.proposal[6],
          paid: action.proposal[7],
          charityAddress: action.proposal[8],
          proposer: action.proposal[9],
          paidBy: action.proposal[10]
        },
        loadingOne: false
      }
    default:
      return state;
  }
}
