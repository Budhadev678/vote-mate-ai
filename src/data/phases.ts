export interface Phase {
  num: number
  name: string
  status: 'done' | 'active' | 'pending'
  date: string
  steps: string[]
  question: string
  icon: string
}

export const phases: Phase[] = [
  {
    num: 1,
    name: 'Election Announcement',
    status: 'done',
    date: 'Completed · Dec 2025',
    icon: '📢',
    steps: [
      'Election Commission announces election schedule',
      'Model Code of Conduct comes into effect',
      'Official notification issued in Government Gazette',
      'Dates for nomination, polling and counting announced',
    ],
    question: 'What happens when elections are announced in India?',
  },
  {
    num: 2,
    name: 'Voter Registration & Roll Revision',
    status: 'done',
    date: 'Completed · Jan 2026',
    icon: '📋',
    steps: [
      'Electoral rolls published and made available',
      'Citizens check and update their voter registration',
      'Booth-level officers verify roll accuracy',
      'Final electoral rolls published before nomination',
    ],
    question: 'How does voter roll revision work in Indian elections?',
  },
  {
    num: 3,
    name: 'Nomination of Candidates',
    status: 'done',
    date: 'Completed · Feb 2026',
    icon: '🏛️',
    steps: [
      'Candidates file nomination papers with Returning Officer',
      'Security deposits paid by candidates',
      'Nomination papers scrutinized for eligibility',
      'Candidates may withdraw nominations by deadline',
    ],
    question: 'How does candidate nomination work in Indian elections?',
  },
  {
    num: 4,
    name: 'Election Campaign',
    status: 'active',
    date: 'Ongoing · ends 48h before polling',
    icon: '📣',
    steps: [
      'Candidates and parties campaign in constituencies',
      'Campaign expenditure limits enforced by EC',
      'Model Code of Conduct strictly enforced',
      'Silence period begins 48 hours before polling',
    ],
    question: 'What are the rules during election campaigns in India?',
  },
  {
    num: 5,
    name: 'Polling Day',
    status: 'pending',
    date: 'Upcoming · May 2026',
    icon: '🗳️',
    steps: [
      'Polling stations open at 7 AM, close at 6 PM',
      'Voters verify identity and receive ballot/EVM access',
      'EVMs sealed after polling; mock polls conducted',
      'Security forces deployed for peaceful polling',
    ],
    question: 'What happens on polling day step by step?',
  },
  {
    num: 6,
    name: 'Vote Counting & Results',
    status: 'pending',
    date: 'Upcoming · after polling',
    icon: '📊',
    steps: [
      'EVMs transported to strong rooms under guard',
      'Counting begins on designated counting day',
      'Candidates and agents observe the counting',
      'Returning Officer declares winner; EC certifies',
    ],
    question: 'How are votes counted and results declared?',
  },
]
