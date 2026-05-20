export interface Proposal {
  _id?: string;
  title: string;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Declined' | 'Expired' | 'Archived';
  version?: string;
  category?: string;
  templateName?: string;
  internalNotes?: string;
  deliveryMethod?: string;
  viewedAt?: Date;
  acceptedAt?: Date;
  leadSource?: string;
  weddingWebsite?: string;
  weddingHashtag?: string;
  officiant?: { name: string; contact: string };
  planner?: { name: string; contact: string };
  venueContingency?: string;
  weatherContingency?: string;
  specialRequests?: string;
  dietaryRestrictions?: string;
  musicPreferences?: string;
  shotList?: string;
  setupInstructions?: string;
  cancellationPolicy?: string;
  reschedulePolicy?: string;
  insuranceRequired?: boolean;
  permitsRequired?: string;
  vendorMealCount?: number;
  parkingInstructions?: string;
  emergencyContact?: { name: string; phone: string };
  language?: string;
  currency?: string;
  taxExemptionId?: string;
  paymentMethods?: string[];
  autoPaymentReminders?: boolean;
  clientCredentials?: string;
  revisionHistory?: string[];
  teamMember?: string;
  timezone?: string;
  ceremonyStyle?: string;
  dressCode?: string;
  hotelBlock?: string;
  shuttleSchedule?: string;
  rehearsalDetails?: string;
  deliverablesTimeline?: string;
  testimonialRequest?: boolean;
  socialMediaPermissions?: boolean;
  privacyConsent?: boolean;
  expirationReminderSent?: boolean;
  followUpTasks?: string[];
  crmId?: string;
  attachments?: string[];
  workflowStage?: string;
  shareLink?: string;
  mobileOptimized?: boolean;
  
  clientId?: string;
  userId?: string;
  blocks: ProposalBlock[];
  createdAt?: Date;
}

export type ProposalBlock = HeaderBlock | TextBlock | InvoiceBlock | ContractBlock | QuestionnaireBlock;

export interface BaseBlock {
  id: string;
  type: 'header' | 'text' | 'invoice' | 'contract' | 'questionnaire';
}

export interface HeaderBlock extends BaseBlock {
  type: 'header';
  content: {
    logoUrl?: string;
    companyName: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    phone?: string;
    website?: string;
    clientName?: string;
    clientAddress?: string;
    clientCity?: string;
    clientState?: string;
    clientZip?: string;
  };
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: {
    heading?: string;
    body: string;
  };
}

export interface InvoiceBlock extends BaseBlock {
  type: 'invoice';
  content: {
    items: InvoiceItem[];
    notes?: string;
  };
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

export interface ContractBlock extends BaseBlock {
  type: 'contract';
  content: {
    terms: string;
    signatureRequired: boolean;
    signedBy?: string;
    signedAt?: Date;
  };
}

export interface QuestionnaireBlock extends BaseBlock {
  type: 'questionnaire';
  content: {
    questions: Question[];
  };
}

export interface Question {
  id: string;
  type: 'text' | 'choice';
  label: string;
  options?: string[];
  answer?: string;
}
