import { walletConstants } from '../../constants/walletConstants'

const initialState = {
  address: '',
  phone: '',
  txHash: ''
};

export function wallet(state = initialState, action) {
  switch (action.type) {
    case walletConstants.CONNECT_SUCCESS:
      return {
        ...state,
        address: action.res.address,
        phone: action.res.phoneNumber,
      };
    case walletConstants.CONTRIBUTION_SUCCESS:
      return {
        ...state,
        txHash: action.res.transactionHash,
        status: action.res.status
      }
    default:
      return state
  }
}
