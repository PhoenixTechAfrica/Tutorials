/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  AllProposalScreen: undefined;
  ViewOneProposalScreen: undefined;
  CreateProposalScreen: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type Proposal = {
  id: string
  description: string,
  charityAddress: string,
  amount: string
  proposer: string,
  livePeriod: string,
  votesFor: string,
  votesAgainst: string,
  vottingPassed: boolean,
  paid: boolean,
  paidBy: string
}
