export interface ContractVersion {
  id: string;
  version: number;
  title: string;
  content: string;
  changes: string;
  changeType: 'created' | 'edited' | 'approved' | 'rejected' | 'signed';
  changedFields?: string[];
  previousVersion?: string;
  parentVersionId?: string;
  isMinorEdit?: boolean;
  createdAt: string;
  createdBy: string;
  createdByRole: string;
  fileSize?: number;
  checksum?: string;
  changeDescription?: string;
  changeReason?: string;
}

export interface ContractComment {
  id: string;
  contractId: string;
  userId: string;
  userName: string;
  content: string;
  highlightedText?: string;
  position?: { start: number; end: number };
  createdAt: string;
  isResolved: boolean;
}

export interface ContractTag {
  id: string;
  name: string;
  color: string;
  category: string;
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverRole: string;
  requiredHierarchyLevel: number;
  contractValueThreshold?: number;
  approverName?: string;
  approverId?: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: string;
  timeSpent?: number; // Thời gian xử lý (phút)
}

export interface ContractReminder {
  id: string;
  contractId: string;
  type: 'expiry' | 'renewal' | 'review';
  reminderDate: string;
  message: string;
  isActive: boolean;
}

export interface ESignatureRequest {
  id: string;
  contractId: string;
  signers: Array<{
    email: string;
    name: string;
    role: string;
    signed: boolean;
    signedAt?: string;
  }>;
  provider: 'docusign' | 'adobe' | 'viettel';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'signed' | 'expired';
  uploadDate: string;
  reviewDate?: string;
  expiryDate?: string;
  renewalDate?: string;
  reviewer?: string;
  comments?: string;
  rejectionReason?: string;
  rejectionCategory?: 'legal' | 'financial' | 'technical' | 'policy' | 'other';
  tags: ContractTag[];
  versions: ContractVersion[];
  currentVersion: number;
  approvalSteps: ApprovalStep[];
  currentStep: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  contractValue?: number;
  currency?: string;
  reminders: ContractReminder[];
  eSignature?: ESignatureRequest;
  extractedInfo?: {
    contractType: string;
    parties: string[];
    value: string;
    numericValue?: number;
    duration: string;
    summary: string;
    fullText: string;
    keyTerms?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
    // Thông tin tóm tắt chi tiết
    contractNumber?: string;
    signDate?: string;
    effectiveDate?: string;
    expirationDate?: string;
    purpose: string;
    paymentMethod?: string;
    paymentSchedule?: string;
    warrantyInfo?: string;
    penaltyClause?: string;
    disputeResolution?: string;
    attachments?: string[];
    currentStatus?: string;
    paymentProgress?: number;
    responsiblePerson?: string;
    specialNotes?: string;
  };
  file?: File;
  finalPdfUrl?: string;
  createdBy: string;
  createdManually?: boolean;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
}

export interface DashboardStats {
  totalContracts: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  expiringSoon: number;
  averageProcessingTime: number;
  approvalRate: number;
  monthlyUploads: number[];
  rejectionReasons: Array<{ reason: string; count: number }>;
}