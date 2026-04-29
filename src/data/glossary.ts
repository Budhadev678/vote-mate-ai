export interface GlossaryTerm {
  term: string
  def: string
  tag: 'process' | 'legal' | 'body'
  tagLabel: string
}

export const glossary: GlossaryTerm[] = [
  { term: 'Electoral Roll', def: 'Official list of registered voters in a constituency. Must be updated before each election.', tag: 'process', tagLabel: 'Process' },
  { term: 'Returning Officer', def: 'Government official responsible for overseeing the election in a constituency and declaring results.', tag: 'body', tagLabel: 'Body' },
  { term: 'EVM (Electronic Voting Machine)', def: 'Tamper-proof electronic device used to cast and record votes. Replaces paper ballots in India.', tag: 'process', tagLabel: 'Process' },
  { term: 'VVPAT', def: 'Voter Verifiable Paper Audit Trail — a paper slip printed when a voter casts their EVM vote for verification.', tag: 'process', tagLabel: 'Process' },
  { term: 'Model Code of Conduct', def: 'Guidelines issued by Election Commission to regulate party and candidate behavior once elections are announced.', tag: 'legal', tagLabel: 'Legal' },
  { term: 'Affidavit', def: 'Sworn declaration by a candidate disclosing criminal record, financial assets, and educational qualifications.', tag: 'legal', tagLabel: 'Legal' },
  { term: 'Constituency', def: 'Geographical area represented by one elected member. Voters in each constituency elect one representative.', tag: 'body', tagLabel: 'Body' },
  { term: 'Polling Booth', def: 'Designated location where voters in a specific area come to cast their votes on election day.', tag: 'body', tagLabel: 'Body' },
  { term: 'Nomination', def: 'Formal process where a candidate submits papers declaring their intention to contest an election.', tag: 'process', tagLabel: 'Process' },
  { term: 'Security Deposit', def: 'Amount paid by candidate when filing nomination, refunded if they secure minimum vote threshold.', tag: 'legal', tagLabel: 'Legal' },
  { term: 'Counting Agent', def: "Representative appointed by a candidate to observe and monitor the vote-counting process.", tag: 'body', tagLabel: 'Body' },
  { term: 'Result Notification', def: 'Official announcement by the Returning Officer after counting confirming the winning candidate.', tag: 'process', tagLabel: 'Process' },
  { term: 'Booth Capturing', def: 'Illegal act of taking control of a polling station. Leads to re-polling and criminal proceedings.', tag: 'legal', tagLabel: 'Legal' },
  { term: 'Silence Period', def: '48-hour period before polling where all campaigning is prohibited to allow voters to decide freely.', tag: 'legal', tagLabel: 'Legal' },
  { term: 'Postal Ballot', def: 'Method allowing certain voters (military, government officials) to vote by post if unable to reach booths.', tag: 'process', tagLabel: 'Process' },
  { term: 'Strong Room', def: 'Highly secured facility where EVMs are stored between polling day and counting day.', tag: 'body', tagLabel: 'Body' },
  { term: 'Election Commission of India', def: 'Constitutional body responsible for administering and supervising all elections in India.', tag: 'body', tagLabel: 'Body' },
  { term: 'Anti-Defection Law', def: 'Law preventing elected officials from switching parties after election without losing their seat.', tag: 'legal', tagLabel: 'Legal' },
]
