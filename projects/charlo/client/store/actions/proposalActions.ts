import * as Linking from "expo-linking";
import { FeeCurrency, requestTxSig, waitForSignedTxs } from "@celo/dappkit";
import { toTxResult } from "@celo/connect";

import {  proposalConstants } from "../../constants/proposal.constants";
import { alertActions } from "./alertAction";
import { contractInstance, kit } from '../../root';
import { Proposal } from "../../types";

export const proposalActions = {
    createProposal,
    getAllProposals,
    getProposal
}

function createProposal(proposal: Proposal) {
    return async (dispatch: any) => {
        dispatch(request("Creating proposal..."))

        try {
            const requestId = "create_proposal";
            const dappName = "Charlo";
            const callback = Linking.makeUrl("two") // Fix: should navigate to viewproposal screen

            const txObject = (await contractInstance).methods.createProposal(proposal.description, proposal.charityAddress, proposal.amount);
            console.log(kit.defaultAccount);
            
            const txa = (await contractInstance).methods.isStakeholder(kit.defaultAccount).call();
            const txb = (await contractInstance).methods.isContributor(kit.defaultAccount).call();
            console.log("Segun: ", await txa);
            console.log("Emma: ", await txb);
            

            requestTxSig(
                kit,
                [
                    {
                        from: kit.defaultAccount || proposal.proposer,
                        to: (await contractInstance).options.address,
                        tx: txObject,
                        feeCurrency: FeeCurrency.cUSD
                    }
                ],
                {requestId, dappName, callback}
            );

            const response = await waitForSignedTxs(requestId);
            const tx = response.rawTxs[0];

            const result = await toTxResult(kit.web3.eth.sendSignedTransaction(tx)).waitReceipt();

            dispatch(success(result));
        } catch (error) {
            dispatch(failure(error.toString()));
            dispatch(alertActions.error(error.toString()));
        }
    }

    function request(message: string) { return { type: proposalConstants.CREATE_PROPOSAL_REQUEST, message } };
    function success(res: object) { return { type: proposalConstants.CREATE_PROPOSAL_SUCCESS, res } };
    function failure(error: any) { return { type: proposalConstants.CREATE_PROPOSAL_FAILURE, error } };
}

function getAllProposals() {
    return async (dispatch: any) => {
        dispatch(request("Fetching all proposals..."));

        try {
            const allProposals = (await contractInstance).methods.getProposals().call();
            dispatch(success(allProposals));
        } catch (error) {
            failure(error);
            dispatch(alertActions.error(error.toString()));
        }
    }

    function request(message: string) { return { type: proposalConstants.GET_ALL_PROPOSAL_REQUEST, message } };
    function success(res: Proposal[]) { return { type: proposalConstants.GET_ALL_PROPOSAL_SUCCESS, res } };
    function failure(error: any) { return { type: proposalConstants.GET_ALL_PROPOSAL_FAILURE, error } };
}

function getProposal(id: string) {
    return async (dispatch: any) => {
        dispatch(request(`Fetching proposal with id ${id}`));

        try {
            const proposal = (await contractInstance).methods.getProposal(id);
            dispatch(success(proposal))
        } catch (error) {
            failure(error);
            dispatch(alertActions.error(error.toString()));
        }
    }

    function request(message: string) { return { type: proposalConstants.GET_PROPOSAL_REQUEST, message } };
    function success(proposal: Proposal) { return { type: proposalConstants.GET_PROPOSAL_SUCCESS, proposal } };
    function failure(error: any) { return { type: proposalConstants.GET_PROPOSAL_FAILURE, error } };
}
