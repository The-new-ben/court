import { caseService, Case } from './caseService';

export interface AnalyticsMetrics {
  averageDuration: number;
  outcomeCounts: Record<string, number>;
  totalComplianceViolations: number;
}

export async function calculateAnalytics(): Promise<AnalyticsMetrics> {
  const cases: Case[] = await caseService.getAllCases();

  const totalDuration = cases.reduce((sum, c) => sum + (c.duration || 0), 0);
  const outcomeCounts: Record<string, number> = {};
  let totalComplianceViolations = 0;

  cases.forEach((c) => {
    if (c.outcome) {
      outcomeCounts[c.outcome] = (outcomeCounts[c.outcome] || 0) + 1;
    }
    totalComplianceViolations += c.complianceViolations || 0;
  });

  const averageDuration = cases.length ? totalDuration / cases.length : 0;

  return {
    averageDuration,
    outcomeCounts,
    totalComplianceViolations,
  };
}
