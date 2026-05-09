export type Role = 'ADMIN' | 'SALES_MANAGER' | 'SALES_REP';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'WON' | 'LOST';
export type LeadSource = 'WEBSITE' | 'LINKEDIN' | 'REFERRAL' | 'COLD_EMAIL' | 'EVENT' | 'OTHER';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  source: LeadSource;
  status: LeadStatus;
  priority: Priority;
  dealValue: number;
  assignedToId?: string;
  assignedTo?: { id: string; name: string; email: string };
  createdBy?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  notes?: Note[];
  attachments?: Attachment[];
  _count?: { notes: number; attachments: number };
}

export interface Note {
  id: string;
  content: string;
  createdBy: { id: string; name: string };
  createdAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  uploadedBy: { id: string; name: string };
  createdAt: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalDealValue: number;
  wonDealValue: number;
  byStatus: { status: LeadStatus; _count: number }[];
  bySource: { source: LeadSource; _count: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}