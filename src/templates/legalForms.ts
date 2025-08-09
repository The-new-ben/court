import { Language } from '../contexts/LanguageContext';

export const legalFormTemplates: Record<Language, { powerOfAttorney: string; complaint: string }> = {
  en: {
    powerOfAttorney: `POWER OF ATTORNEY\n\nI, [Client Name], hereby appoint [Attorney Name] as my lawful representative in all matters concerning [Case Details].`,
    complaint: `COMPLAINT\n\nPlaintiff: [Name]\nDefendant: [Name]\nFacts: [Details]\nRelief Sought: [Relief]`
  },
  he: {
    powerOfAttorney: `ייפוי כוח\n\nאני, [שם הלקוח], ממנה בזאת את [שם עורך הדין] כנציגי החוקי בכל הנוגע ל[פרטי המקרה].`,
    complaint: `כתב תביעה\n\nתובע: [שם]\nנתבע: [שם]\nעובדות: [פרטים]\nסעד מבוקש: [סעד]`
  }
};
