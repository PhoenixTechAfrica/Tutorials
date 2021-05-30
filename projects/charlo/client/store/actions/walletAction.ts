import { FeeCurrency, requestAccountAddress, requestTxSig, waitForAccountAuth, waitForSignedTxs } from "@celo/dappkit";
import * as Linking from "expo-linking";

import { walletConstants } from "../../constants/wallet.constants";
import { alertActions } from "./alertAction";
import { kit, contractInstance, web3 } from "../../root";
import BigNumber from "bignumber.js";

export const walletActions = {
    connect, contribute
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

function contribute(amount: string) {
    return async (dispatch: any) => {
        dispatch(request('Transfer initiated...'));

        try {
            const stableToken = await kit.contracts.getGoldToken();
            const transferTo = (await contractInstance).options.address;
            const txObject = stableToken.transfer(transferTo, amount).txo;

            const requestId = 'transfer';
            const dappName = 'Charlo';
            const callback = Linking.makeUrl('two');

            requestTxSig(
                kit,
                [
                    {
                        tx: txObject,
                        from: kit && kit.defaultAccount || '',
                        to: stableToken.contract.options.address,
                        feeCurrency: FeeCurrency.cUSD
                    }
                ],
                { requestId, dappName, callback }
            );

            const response = await waitForSignedTxs(requestId);
            const rawTx = response.rawTxs[0];

            const txa = (await contractInstance).methods.isStakeholder(kit.defaultAccount).call();
            const txb = (await contractInstance).methods.isContributor(kit.defaultAccount).call();
            console.log("Segun: ", await txa);
            console.log("Emma: ", await txb);
            console.log("segs: ", kit.defaultAccount);
            
            

            // Send the signed transaction via the kit
            const tx = await kit.connection.sendSignedTransaction(rawTx);
            const receipt = await tx.waitReceipt();

            dispatch(success(receipt));
        } catch (error) {
            dispatch(failure(error.toString()));
            dispatch(alertActions.error(error.toString()));
        }
    }

    function request(message: string) { return { type: walletConstants.CONTRIBUTION_REQUEST, message } };
    function success(res: object) { return { type: walletConstants.CONTRIBUTION_SUCCESS, res } };
    function failure(error: any) { return { type: walletConstants.CONTRIBUTION_FAILURE, error } };
}
