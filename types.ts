export enum Sender {
  User = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export enum PurchaseDomain {
  IT = 'IT Services & Software',
  Furniture = 'Furniture & Fittings',
  Logistics = 'Logistics & Transport',
  Medical = 'Medical Equipment',
  Construction = 'Construction & Renovation',
  General = 'General Goods',
  Unspecified = 'Unspecified'
}

export interface TenderAnalysis {
  keyPoints: string[];
  domain: PurchaseDomain;
  recommendedTemplate: string;
  reasoning: string;
  structure?: string[];
}

export interface TenderTemplateConfig {
  domain: PurchaseDomain;
  sections: string[];
  focusArea: string;
  complianceKeywords: string[];
}

export interface TenderTemplate {
  title: string;
  content: string; // Markdown content
}

export interface TenderClause {
  id: string;
  title: string;
  content: string;
  mandatory: boolean;
}

export interface SavedTender {
  id: string;
  name: string;
  domain: PurchaseDomain;
  createdAt: string;
  analysis: TenderAnalysis;
  structure: string[];
  draftContent?: string;
}