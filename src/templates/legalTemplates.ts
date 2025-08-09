export const legalTemplates: Record<string, string> = {
  summons: `Summons\nCase Number: {{caseNumber}}\nPlaintiff: {{plaintiff}}\nDefendant: {{defendant}}\n\nYou are hereby summoned to appear in court on {{date}}.`,
  order: `Court Order\nCase Number: {{caseNumber}}\nOrder:\n{{orderDetails}}\n\nIssued on {{date}}.`
};
