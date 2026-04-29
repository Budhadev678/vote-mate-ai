export interface ChecklistItem {
  id: number
  label: string
  cat: string
}

export const checklistItems: ChecklistItem[] = [
  { id: 1, label: 'Check your name on the electoral roll at voters.eci.gov.in', cat: 'Registration' },
  { id: 2, label: 'Carry a valid photo ID to the polling booth (Voter ID, Aadhaar, passport etc.)', cat: 'Documents' },
  { id: 3, label: 'Know your polling booth location in advance', cat: 'Preparation' },
  { id: 4, label: "Understand your constituency's candidates and their manifestos", cat: 'Awareness' },
  { id: 5, label: 'Arrive at booth before 6 PM — queues are not cut off at closing time', cat: 'Day of poll' },
  { id: 6, label: 'Do not carry mobile phones or cameras inside the voting booth', cat: 'Rules' },
  { id: 7, label: 'Apply ink mark: verify it is on your left forefinger before leaving', cat: 'Day of poll' },
  { id: 8, label: 'Watch the VVPAT slip to confirm your vote is recorded correctly', cat: 'Verification' },
  { id: 9, label: 'Do not accept gifts, money, or inducements from candidates', cat: 'Ethics' },
  { id: 10, label: 'Report violations to the National Grievance Helpline: 1950', cat: 'Civic duty' },
]
