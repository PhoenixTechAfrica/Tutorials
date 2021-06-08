import { proposalConstants } from '../../constants/proposalConstants';

const initialState = {
  proposals: [],
  proposal: {},
  txHash: '',
  loadingAll: false,
  loadingOne: false,
  loadingNew: false,
  loadingVote: false
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
    case proposalConstants.VOTE_PROPOSAL_REQUEST:
      return {
        ...state,
        loadingVote: true
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
        proposal: action.proposal,
        loadingOne: false
      };
    case proposalConstants.VOTE_PROPOSAL_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        loadingVote: false
      };
    case proposalConstants.CREATE_PROPOSAL_FAILED:
    case proposalConstants.GET_ALL_PROPOSAL_FAILED:
    case proposalConstants.GET_PROPOSAL_FAILED:
    case proposalConstants.VOTE_PROPOSAL_FAILED:
      return {
        ...state,
        loadingNew: false,
        loadingAll: false,
        loadingOne: false,
        loadingVote: false
      };
    default:
      return state;
  }
}
