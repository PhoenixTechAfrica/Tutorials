import { walletConstants } from "../../constants/wallet.constants";

const initialState = {
    failed: true,
    connecting: false,
    message: '',
    address: '',
    phone: '',
    status: false,
    txHash: '',
    error: ''
};

export function wallet(state = initialState, action: any) {
    switch (action.type) {
        case walletConstants.CONNECT_REQUEST:
        case walletConstants.CONTRIBUTION_REQUEST:
            return {
                connecting: true,
                message: action.message
            };
        case walletConstants.CONNECT_SUCCESS:
            return {
                failed: false,
                address: action.res.address,
                phone: action.res.phoneNumber
            };
        case walletConstants.CONNECT_FAILURE:
        case walletConstants.CONTRIBUTION_FAILURE:
            return {
                error: action.error
            };
        case walletConstants.CONTRIBUTION_SUCCESS:
            return {
                ...state,
                failed: false,
                txHash: action.res.transactionHash,
                status: action.res.status
            }
        default:
            return state
    }
}
