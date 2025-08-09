import { Case, caseService } from '../services/caseService';
import { allowedTransitions, CaseStage } from './types';

class CaseStateService {
  async moveToStage(id: string, newStage: CaseStage): Promise<Case> {
    const caseData = await caseService.getCase(id);
    if (!caseData) {
      throw new Error('Case not found');
    }

    const possible = allowedTransitions[caseData.stage];
    if (!possible.includes(newStage)) {
      throw new Error(`Invalid transition from ${caseData.stage} to ${newStage}`);
    }

    const updatedCase: Case = {
      ...caseData,
      stage: newStage,
      history: [...caseData.history, { stage: newStage, timestamp: new Date().toISOString() }],
    };
    await caseService.saveCase(updatedCase);
    return updatedCase;
  }
}

export const caseStateService = new CaseStateService();
