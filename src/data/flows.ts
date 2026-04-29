export interface FlowNode {
  label: string
  sub: string
  color: 'blue' | 'green' | 'amber' | 'navy' | 'purple' | 'red'
}

export interface FlowDefinition {
  id: string
  name: string
  nodes: FlowNode[]
}

export const flows: FlowDefinition[] = [
  {
    id: 'voting',
    name: 'Voting Process',
    nodes: [
      { label: 'Voter arrives at booth', sub: 'With valid photo ID', color: 'blue' },
      { label: 'Name verified on roll', sub: 'Officer checks register', color: 'blue' },
      { label: 'Ink mark applied', sub: 'Left forefinger', color: 'amber' },
      { label: 'EVM activated', sub: 'Presiding officer', color: 'navy' },
      { label: 'Voter casts vote', sub: 'Presses candidate button', color: 'green' },
      { label: 'VVPAT slip shown', sub: '7-second display', color: 'green' },
    ],
  },
  {
    id: 'nomination',
    name: 'Nomination',
    nodes: [
      { label: 'Candidate files form', sub: 'Returning Officer', color: 'blue' },
      { label: 'Security deposit paid', sub: 'Prescribed amount', color: 'amber' },
      { label: 'Scrutiny by RO', sub: 'Eligibility check', color: 'purple' },
      { label: 'Affidavit submitted', sub: 'Criminal, assets, edu', color: 'blue' },
      { label: 'Withdrawal window', sub: 'Specified deadline', color: 'amber' },
      { label: 'Final candidate list', sub: 'Published by EC', color: 'green' },
    ],
  },
  {
    id: 'counting',
    name: 'Vote Counting',
    nodes: [
      { label: 'EVMs from Strong Room', sub: 'Sealed & guarded', color: 'navy' },
      { label: 'Candidates & agents present', sub: 'Observe counting', color: 'blue' },
      { label: 'Postal ballots counted first', sub: 'Then EVM results', color: 'purple' },
      { label: 'Round-by-round tallying', sub: 'Table-wise counting', color: 'amber' },
      { label: 'Totals verified & signed', sub: 'All agents sign', color: 'green' },
      { label: 'RO declares winner', sub: 'EC certifies result', color: 'green' },
    ],
  },
]
