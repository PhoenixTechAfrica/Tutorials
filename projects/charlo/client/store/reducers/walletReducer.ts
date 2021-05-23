import { walletConstants } from "../../constants/wallet.constants";

const initialState = {
    failed: true,
    connecting: false,
    message: '',
    address: '',
    phone: ''
};

export function wallet(state = initialState, action: any) {
    switch (action.type) {
        case walletConstants.CONNECT_REQUEST:
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
            return {
                error: action.error
            };
        default:
            return state
    }
}
