import { profileConstants } from '../../constants';

const initialState = {
  address: '',
  phone: '',
  daoBalance: '0',
  userBalance: '0',
  isStakeholder: false,
  isContributor: false,
  contributed: "0",
  votes: [],
  txHash: '',
  loadingPay: false,
  loading: false
};

export function profile(state = initialState, action) {
  switch (action.type) {
    case profileConstants.CONNECT_REQUEST:
    case profileConstants.CONTRIBUTION_REQUEST:
    case profileConstants.ROLE_REQUEST:
    case profileConstants.ROLE_CHECK_REQUEST:
    case profileConstants.GET_VOTES_REQUEST:
      return {
        ...state,
        txHash: '',
        loading: true
      };
    case profileConstants.PAY_CHARITY_REQUEST:
      return {
        ...state,
        txHash: '',
        loadingPay: true
      };
    case profileConstants.CONNECT_SUCCESS:
      return {
        ...state,
        address: action.res.address,
        phone: action.res.phoneNumber,
        daoBalance: action.res.daoBalance,
        userBalance: action.res.userBalance,
        txHash: '',
        loading: false
      };
    case profileConstants.PAY_CHARITY_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        loadingPay: false
      };
    case profileConstants.CONTRIBUTION_SUCCESS:
      return {
        ...state,
        daoBalance: action.res.daoBalance,
        userBalance: action.res.userBalance,
        txHash: action.res.transactionHash,
        loading: false
      };
    case profileConstants.ROLE_CHECK_SUCCESS:
      return {
        ...state,
        isStakeholder: action.role.isStakeholder,
        isContributor: action.role.isContributor,
        contributed: action.role.contributed,
        loading: false
      };
    case profileConstants.ROLE_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        loading: false,
      };
    case profileConstants.GET_VOTES_SUCCESS:
      return {
        ...state,
        votes: action.votes,
        loading: false,
      };
    case profileConstants.CONNECT_FAILED:
    case profileConstants.CONTRIBUTION_FAILED:
    case profileConstants.ROLE_CHECK_FAILED:
    case profileConstants.ROLE_FAILED:
    case profileConstants.GET_VOTES_FAILED:
      return {
        ...state,
        loading: false
      };
    case profileConstants.PAY_CHARITY_FAILED:
      return {
        ...state,
        loadingPay: false
      };
    default:
      return state
  }
}
