export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'manager' | 'admin' | 'legal' | 'finance';
  department: string;
  position: string;
  avatar?: string;
  isActive: boolean;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  hierarchyLevel: number; // 1: Employee, 2: Manager, 3: Director, 4: CEO, 5: Admin
  maxContractValue?: number; // Giá trị hợp đồng tối đa có thể duyệt
  createdAt: string;
  lastLogin?: string;
  permissions: {
    canUpload: boolean;
    canApprove: boolean;
    canManageUsers: boolean;
    canViewAnalytics: boolean;
    canSign: boolean;
    canApproveUsers: boolean;
    canCreateManual: boolean;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  department: string;
  position: string;
}