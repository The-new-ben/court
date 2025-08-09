export type CaseStage = 'filing' | 'discovery' | 'hearing' | 'verdict';

export interface CaseHistoryEntry {
  stage: CaseStage;
  timestamp: string;
}

export const allowedTransitions: Record<CaseStage, CaseStage[]> = {
  filing: ['discovery'],
  discovery: ['hearing'],
  hearing: ['verdict'],
  verdict: [],
};
