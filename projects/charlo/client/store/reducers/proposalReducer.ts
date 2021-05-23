import { proposalConstants } from "../../constants/proposal.constants";
import { Proposal } from "../../types";

const initialState = {
    proposals: [],
    connecting: false,
    message: '',
    status: '',
    txHash: '',
    proposal: undefined,
    error: ''
};

export function proposal(state = initialState, action: any) {
    switch (action.type) {
        case proposalConstants.CREATE_PROPOSAL_REQUEST:
        case proposalConstants.GET_ALL_PROPOSAL_REQUEST:
        case proposalConstants.GET_PROPOSAL_REQUEST:
            return {
                connecting: true,
                message: action.message
            };
        case proposalConstants.CREATE_PROPOSAL_SUCCESS:
            return {
                status: true,
                txHash: action.res.transactionHash,
            }
        case proposalConstants.CREATE_PROPOSAL_FAILURE:
        case proposalConstants.GET_ALL_PROPOSAL_FAILURE:
        case proposalConstants.GET_PROPOSAL_FAILURE:
            return {
                error: action.error
            }
        case proposalConstants.GET_ALL_PROPOSAL_SUCCESS:
            return {
                proposals: action.res
            }
        case proposalConstants.GET_PROPOSAL_SUCCESS:
            return {
                proposal: action.res
            }
        default:
            return state;
    }
}
