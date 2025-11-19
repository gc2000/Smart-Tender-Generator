import { PurchaseDomain, TenderTemplateConfig, TenderClause } from '../types';
import { TENDER_TEMPLATES } from '../config/tenderTemplates';
import { CLAUSE_LIBRARY } from '../config/clauseLibrary';

const TEMPLATE_STORAGE_KEY = 'smart_tender_config_templates';
const CLAUSE_STORAGE_KEY = 'smart_tender_config_clauses';

// --- TEMPLATES MANAGEMENT ---

export const getAllTemplates = (): Record<string, TenderTemplateConfig> => {
  try {
    const stored = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load templates from storage", e);
  }
  // Fallback to defaults
  return TENDER_TEMPLATES;
};

export const getDynamicTemplateConfig = (domain: PurchaseDomain): TenderTemplateConfig => {
  const templates = getAllTemplates();
  return templates[domain] || templates[PurchaseDomain.General];
};

export const saveAllTemplates = (templates: Record<string, TenderTemplateConfig>) => {
  localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(templates));
};

export const resetTemplatesToDefault = () => {
  localStorage.removeItem(TEMPLATE_STORAGE_KEY);
};

// --- CLAUSES MANAGEMENT ---

export const getAllClauses = (): Record<string, TenderClause[]> => {
  try {
    const stored = localStorage.getItem(CLAUSE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load clauses from storage", e);
  }
  // Fallback to defaults
  return CLAUSE_LIBRARY;
};

export const getDynamicStandardClauses = (domain: PurchaseDomain): TenderClause[] => {
  const library = getAllClauses();
  const specificClauses = library[domain] || [];
  const generalClauses = domain !== PurchaseDomain.General ? (library[PurchaseDomain.General] || []) : [];
  
  if (specificClauses.length === 0 && domain !== PurchaseDomain.General) {
     return generalClauses;
  }

  return [...specificClauses, ...generalClauses];
};

export const saveAllClauses = (clauses: Record<string, TenderClause[]>) => {
  localStorage.setItem(CLAUSE_STORAGE_KEY, JSON.stringify(clauses));
};

export const resetClausesToDefault = () => {
  localStorage.removeItem(CLAUSE_STORAGE_KEY);
};
