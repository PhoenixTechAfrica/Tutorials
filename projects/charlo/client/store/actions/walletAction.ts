import { requestAccountAddress, waitForAccountAuth } from "@celo/dappkit";
import * as Linking from "expo-linking";

import { walletConstants } from "../../constants/wallet.constants";
import { alertActions } from "./alertAction";
import { kit } from "../../root";

export const walletActions = {
    connect
}

function connect() {
    return async (dispatch: any) => {
        dispatch(request("Connecting to wallet..."));

        const requestId = 'charlo_login';
        const dappName = 'Charlo';
        const callback = Linking.makeUrl("two");

        requestAccountAddress({
            requestId,
            dappName,
            callback
        });

        waitForAccountAuth(requestId)
        .then(res => {
            kit.defaultAccount = res.address;
            dispatch(success(res));
        })
        .catch(err => {
            dispatch(failure(err));
            dispatch(alertActions.error(err.toString()));
        })
    }

    function request(message: string) { return { type: walletConstants.CONNECT_REQUEST, message } };
    function success(res: object) { return { type: walletConstants.CONNECT_SUCCESS, res } };
    function failure(error: any) { return { type: walletConstants.CONNECT_FAILURE, error } };
}
