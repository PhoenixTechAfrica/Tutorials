import { walletConstants } from '../../constants/walletConstants'
import { web3 } from '../../root';

const initialState = {
  address: '',
  phone: '',
  isStakeholder: false,
  isContributor: false,
  contributed: 0,
  txHash: '',
  loading: false
};

export function wallet(state = initialState, action) {
  switch (action.type) {
    case walletConstants.CONNECT_REQUEST:
    case walletConstants.CONTRIBUTION_REQUEST:
    case walletConstants.ROLE_REQUEST:
    case walletConstants.ROLE_CHECK_REQUEST:
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
        txHash: false,
        loading: false
      };
    case walletConstants.ROLE_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        loading: false,
      };
    case walletConstants.CONNECT_FAILED:
    case walletConstants.CONTRIBUTION_FAILED:
    case walletConstants.ROLE_CHECK_FAILED:
    case walletConstants.ROLE_FAILED:
      return {
        ...state,
        txHash: '',
        loading: false
      };
    default:
      return state
  }
}
