import { proposalConstants } from '../../constants/proposalConstants';

const initialState = {
  proposals: [],
  connecting: false,
  message: '',
  status: '',
  txHash: '',
  proposal: {},
  error: ''
};

export function proposal(state = initialState, action) {
  switch (action.type) {
    case proposalConstants.CREATE_PROPOSAL_REQUEST:
    case proposalConstants.GET_ALL_PROPOSAL_REQUEST:
    case proposalConstants.GET_PROPOSAL_REQUEST:
      return {
        connecting: true,
        message: action.message
      };
    case proposalConstants.CREATE_PROPOSAL_SUCCESS:
      return {
        status: true,
        txHash: action.res.transactionHash,
      };
    case proposalConstants.GET_ALL_PROPOSAL_SUCCESS:
      return {
        status: true,
        proposals: action.res
      };
    case proposalConstants.GET_PROPOSAL_SUCCESS:
      return {
        ...state,
        proposal: action.res
      };
    case proposalConstants.CREATE_PROPOSAL_FAILURE:
    case proposalConstants.GET_ALL_PROPOSAL_FAILURE:
    case proposalConstants.GET_PROPOSAL_FAILURE:
      return {
        error: action.error
      };
    default:
      return state;
  }
}
