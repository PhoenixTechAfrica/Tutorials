import { walletConstants } from '../../constants/walletConstants';

const initialState = {
  address: '',
  phone: '',
  isStakeholder: false,
  isContributor: false,
  contributed: "0",
  votes: [],
  txHash: '',
  loading: false
};

export function wallet(state = initialState, action) {
  switch (action.type) {
    case walletConstants.CONNECT_REQUEST:
    case walletConstants.CONTRIBUTION_REQUEST:
    case walletConstants.ROLE_REQUEST:
    case walletConstants.ROLE_CHECK_REQUEST:
    case walletConstants.GET_VOTES_REQUEST:
      return {
        ...state,
        txHash: '',
        loading: true
      };
    case walletConstants.CONNECT_SUCCESS:
      return {
        ...state,
        address: action.res.address,
        phone: action.res.phoneNumber,
        txHash: '',
        loading: false
      };
    case walletConstants.CONTRIBUTION_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        loading: false
      };
    case walletConstants.ROLE_CHECK_SUCCESS:
      return {
        ...state,
        isStakeholder: action.role.isStakeholder,
        isContributor: action.role.isContributor,
        contributed: action.role.contributed,
        loading: false
      };
    case walletConstants.ROLE_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        loading: false,
      };
    case walletConstants.GET_VOTES_SUCCESS:
      return {
        ...state,
        votes: action.votes,
        loading: false,
      };
    case walletConstants.CONNECT_FAILED:
    case walletConstants.CONTRIBUTION_FAILED:
    case walletConstants.ROLE_CHECK_FAILED:
    case walletConstants.ROLE_FAILED:
    case walletConstants.GET_VOTES_FAILED:
      return {
        ...state,
        loading: false
      };
    default:
      return state
  }
}
