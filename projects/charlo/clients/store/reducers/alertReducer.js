import { alertConstants } from "../../constants/alertConstants";

export function alert(state = {}, action) {
    switch (action.type) {
        case alertConstants.REQUEST:
            return {
                type: 'alert-request',
                loading: true,
                message: action.message
            }
        case alertConstants.SUCCESS:
            return {
                type: 'alert-success',
                loading: false,
                message: action.message
            };
        case alertConstants.ERROR:
            return {
                type: 'alert-danger',
                loading: false,
                message: action.message
            };
        case alertConstants.CLEAR:
            return {};
        default:
            return state
    }
}
