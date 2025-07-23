import React, { useState, useEffect } from 'react';
import { FileText, Upload, BarChart3, Users, Settings, HelpCircle, LogOut, Menu, X, Bell, Search, Plus } from 'lucide-react';
import { Contract, ContractTag, DashboardStats, ContractComment, ContractReminder, ESignatureRequest } from './types/contract';
import { User, AuthState, LoginCredentials, RegisterData } from './types/user';
import { AuthModal } from './components/AuthModal';
import { ContractEditor } from './components/ContractEditor';
import { VersionHistory } from './components/VersionHistory';
import { VersionComparison } from './components/VersionComparison';
import { AdvancedVersionHistory } from './components/AdvancedVersionHistory';
import { ContractComments } from './components/ContractComments';
import { ContractReminders } from './components/ContractReminders';
import { ESignaturePanel } from './components/ESignaturePanel';
import { MultiStepApproval } from './components/MultiStepApproval';
import { HierarchyApprovalFlow } from './components/HierarchyApprovalFlow';
import { AdvancedDashboard } from './components/AdvancedDashboard';
import { DetailedAnalytics } from './components/DetailedAnalytics';
import { TimeBasedAnalytics } from './components/TimeBasedAnalytics';
import { UserManagement } from './components/UserManagement';
import { UserApprovalPanel } from './components/UserApprovalPanel';
import { HelpGuide } from './components/HelpGuide';
import { ManualContractCreator } from './components/ManualContractCreator';

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('contracts');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractEditor, setShowContractEditor] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [comparisonVersions, setComparisonVersions] = useState<{ v1: any; v2: any } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualCreator, setShowManualCreator] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@company.com',
      name: 'Quản trị viên',
      role: 'admin',
      department: 'IT',
      position: 'System Administrator',
      isActive: true,
      isApproved: true,
      hierarchyLevel: 5,
      createdAt: '2024-01-01T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: true,
        canCreateManual: true
      }
    },
    {
      id: '2',
      email: 'manager@company.com',
      name: 'Nguyễn Văn Manager',
      role: 'manager',
      department: 'Operations',
      position: 'Operations Manager',
      isActive: true,
      isApproved: true,
      hierarchyLevel: 2,
      maxContractValue: 100000000,
      createdAt: '2024-01-01T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: false,
        canCreateManual: true
      }
    },
    {
      id: '3',
      email: 'director@company.com',
      name: 'Trần Văn Director',
      role: 'director',
      department: 'Operations',
      position: 'Operations Director',
      isActive: true,
      isApproved: true,
      hierarchyLevel: 3,
      maxContractValue: 500000000,
      createdAt: '2024-01-01T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: false,
        canCreateManual: true
      }
    },
    {
      id: '4',
      email: 'ceo@company.com',
      name: 'Lê Thị CEO',
      role: 'ceo',
      department: 'Executive',
      position: 'Chief Executive Officer',
      isActive: true,
      isApproved: true,
      hierarchyLevel: 4,
      maxContractValue: Infinity,
      createdAt: '2024-01-01T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: true,
        canCreateManual: true
      }
    },
    {
      id: '5',
      email: 'legal@company.com',
      name: 'Trần Thị Legal',
      role: 'legal',
      department: 'Legal',
      position: 'Legal Specialist',
      isActive: true,
      isApproved: true,
      hierarchyLevel: 2,
      createdAt: '2024-01-01T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: false,
        canCreateManual: true
      }
    },
    {
      id: '6',
      email: 'finance@company.com',
      name: 'Lê Văn Finance',
      role: 'finance',
      department: 'Finance',
      position: 'Finance Manager',
      isActive: true,
      isApproved: true,
      hierarchyLevel: 2,
      maxContractValue: 500000000,
      createdAt: '2024-01-01T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: true,
        canManageUsers: false,
        canViewAnalytics: true,
        canSign: true,
        canApproveUsers: false,
        canCreateManual: true
      }
    },
    {
      id: '7',
      email: 'employee@company.com',
      name: 'Phạm Thị Employee',
      role: 'employee',
      department: 'Sales',
      position: 'Sales Executive',
      isActive: true,
      isApproved: true,
      hierarchyLevel: 1,
      createdAt: '2024-01-01T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canSign: false,
        canApproveUsers: false,
        canCreateManual: false
      }
    },
    {
      id: '8',
      email: 'pending@company.com',
      name: 'Nguyễn Văn Pending',
      role: 'employee',
      department: 'Marketing',
      position: 'Marketing Specialist',
      isActive: false,
      isApproved: false,
      hierarchyLevel: 1,
      createdAt: '2024-01-20T00:00:00Z',
      permissions: {
        canUpload: true,
        canApprove: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canSign: false,
        canApproveUsers: false,
        canCreateManual: false
      }
    }
  ];

  const mockTags: ContractTag[] = [
    { id: '1', name: 'Cung cấp dịch vụ', color: 'blue', category: 'type' },
    { id: '2', name: 'Mua bán hàng hóa', color: 'green', category: 'type' },
    { id: '3', name: 'Thuê mướn', color: 'purple', category: 'type' },
    { id: '4', name: 'Khẩn cấp', color: 'red', category: 'priority' },
    { id: '5', name: 'Quan trọng', color: 'indigo', category: 'priority' },
    { id: '6', name: 'Thường xuyên', color: 'gray', category: 'frequency' }
  ];

  const mockContracts: Contract[] = [
    {
      id: '1',
      title: 'Hợp đồng cung cấp phần mềm quản lý',
      description: 'Hợp đồng cung cấp và triển khai phần mềm quản lý cho công ty',
      status: 'pending',
      uploadDate: '2024-01-15T10:00:00Z',
      priority: 'high',
      contractValue: 150000000,
      currency: 'VND',
      tags: [mockTags[0], mockTags[4]],
      versions: [
        {
          id: 'v1',
          version: 1,
          title: 'Phiên bản gốc',
          content: 'Nội dung hợp đồng cung cấp phần mềm quản lý...',
          changes: 'Tạo mới hợp đồng',
          changeType: 'created',
          createdAt: '2024-01-15T10:00:00Z',
          createdBy: 'Phạm Thị Employee',
          createdByRole: 'employee'
        }
      ],
      currentVersion: 1,
      approvalSteps: [],
      currentStep: 0,
      reminders: [],
      extractedInfo: {
        contractType: 'Hợp đồng cung cấp dịch vụ phần mềm',
        parties: ['Công ty ABC', 'Công ty XYZ Technology'],
        value: '150,000,000 VND',
        numericValue: 150000000,
        duration: '12 tháng',
        summary: 'Hợp đồng cung cấp và triển khai hệ thống phần mềm quản lý tổng thể cho công ty ABC',
        fullText: 'Nội dung đầy đủ của hợp đồng...',
        contractNumber: 'HD-2024-001',
        signDate: '2024-01-15',
        effectiveDate: '2024-02-01',
        expirationDate: '2025-01-31',
        purpose: 'Cung cấp và triển khai phần mềm quản lý kho, bán hàng và tài chính',
        paymentMethod: 'Chuyển khoản',
        paymentSchedule: 'Thanh toán theo tiến độ: 30% ký hợp đồng, 50% nghiệm thu, 20% bảo hành',
        warrantyInfo: 'Bảo hành 12 tháng kể từ ngày nghiệm thu',
        penaltyClause: 'Phạt 0.1%/ngày chậm tiến độ, tối đa 10% giá trị hợp đồng',
        disputeResolution: 'Trọng tài thương mại Việt Nam',
        attachments: ['Bảng báo giá chi tiết', 'Sơ đồ kiến trúc hệ thống'],
        currentStatus: 'Đang chờ phê duyệt',
        paymentProgress: 0,
        responsiblePerson: 'Phạm Thị Employee',
        specialNotes: 'Yêu cầu triển khai trong Q1/2024'
      },
      createdBy: 'employee@company.com'
    }
  ];

  useEffect(() => {
    setUsers(mockUsers);
    setContracts(mockContracts);
    // Auto login as admin for demo
    setAuthState({
      isAuthenticated: true,
      user: mockUsers[0],
      token: 'mock-token'
    });
  }, []);

  const handleLogin = (credentials: LoginCredentials) => {
    const user = mockUsers.find(u => u.email === credentials.email);
    if (user && user.isApproved && user.isActive) {
      setAuthState({
        isAuthenticated: true,
        user,
        token: 'mock-token'
      });
      setShowAuthModal(false);
    } else if (user && !user.isApproved) {
      alert('Tài khoản của bạn chưa được phê duyệt. Vui lòng liên hệ quản trị viên.');
    } else if (user && !user.isActive) {
      alert('Tài khoản của bạn đã bị tạm khóa. Vui lòng liên hệ quản trị viên.');
    } else {
      alert('Email hoặc mật khẩu không đúng.');
    }
  };

  const handleRegister = (data: RegisterData) => {
    const newUser: User = {
      id: Date.now().toString(),
      ...data,
      role: 'employee',
      isActive: false,
      isApproved: false,
      hierarchyLevel: 1,
      createdAt: new Date().toISOString(),
      permissions: {
        canUpload: true,
        canApprove: false,
        canManageUsers: false,
        canViewAnalytics: false,
        canSign: false,
        canApproveUsers: false,
        canCreateManual: false
      }
    };
    setUsers([...users, newUser]);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    setActiveTab('contracts');
  };

  const handleContractSave = (contractId: string, updates: Partial<Contract>) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    // Tạo phiên bản mới khi chỉnh sửa
    const newVersion: ContractVersion = {
      id: `v${contract.versions.length + 1}`,
      version: contract.versions.length + 1,
      title: `Phiên bản ${contract.versions.length + 1} - Chỉnh sửa`,
      content: updates.extractedInfo?.fullText || contract.extractedInfo?.fullText || '',
      changes: 'Chỉnh sửa thông tin hợp đồng',
      changeType: 'edited',
      parentVersionId: contract.versions[contract.versions.length - 1]?.id,
      isMinorEdit: true,
      createdAt: new Date().toISOString(),
      createdBy: authState.user?.name || 'Unknown',
      createdByRole: authState.user?.role || 'unknown',
      changeDescription: 'Cập nhật thông tin hợp đồng',
      changeReason: 'Chỉnh sửa theo yêu cầu'
    };

    const updatedVersions = [...contract.versions, newVersion];
    const updatedContract = {
      ...contract,
      ...updates,
      versions: updatedVersions,
      currentVersion: newVersion.version,
      lastModifiedBy: authState.user?.name,
      lastModifiedAt: new Date().toISOString()
    };

    setContracts(contracts.map(c => 
      c.id === contractId ? updatedContract : c
    ));
    setShowContractEditor(false);
  };

  const handleVersionSelect = (version: any) => {
    console.log('Selected version:', version);
  };

  const handleCompareVersions = (v1: any, v2: any) => {
    setComparisonVersions({ v1, v2 });
    setShowVersionComparison(true);
  };

  const handleAddComment = (contractId: string, content: string, highlightedText?: string) => {
    console.log('Add comment:', { contractId, content, highlightedText });
  };

  const handleDeleteComment = (commentId: string) => {
    console.log('Delete comment:', commentId);
  };

  const handleResolveComment = (commentId: string) => {
    console.log('Resolve comment:', commentId);
  };

  const handleAddReminder = (contractId: string, reminder: Omit<ContractReminder, 'id'>) => {
    console.log('Add reminder:', { contractId, reminder });
  };

  const handleDeleteReminder = (reminderId: string) => {
    console.log('Delete reminder:', reminderId);
  };

  const handleSendForSignature = (contractId: string, signers: any[], provider: string) => {
    console.log('Send for signature:', { contractId, signers, provider });
  };

  const handleApproveStep = (stepId: string, comments?: string) => {
    console.log('Approve step:', { stepId, comments });
  };

  const handleRejectStep = (stepId: string, reason: string) => {
    console.log('Reject step:', { stepId, reason });
  };

  const handleUpdateApprovalFlow = (contractId: string, steps: any[]) => {
    console.log('Update approval flow:', { contractId, steps });
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true,
      isApproved: true,
      hierarchyLevel: userData.role === 'admin' ? 5 : userData.role === 'manager' ? 2 : 1
    };
    setUsers([...users, newUser]);
  };

  const handleUpdateUser = (userId: string, userData: Partial<User>) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...userData } : u));
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleApproveUser = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, isApproved: true, approvedBy: authState.user?.name, approvedAt: new Date().toISOString() } : u
    ));
  };

  const handleRejectUser = (userId: string, reason: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const handleManualContractSave = (contractData: Partial<Contract>) => {
    const newContract: Contract = {
      id: Date.now().toString(),
      ...contractData,
      status: 'draft',
      uploadDate: new Date().toISOString(),
      versions: [
        {
          id: 'v1',
          version: 1,
          title: 'Phiên bản gốc (tạo thủ công)',
          content: contractData.extractedInfo?.fullText || '',
          changes: 'Tạo hợp đồng thủ công',
          changeType: 'created',
          createdAt: new Date().toISOString(),
          createdBy: authState.user?.name || 'Unknown',
          createdByRole: authState.user?.role || 'unknown'
          changeDescription: 'Tạo hợp đồng mới bằng tay',
          changeReason: 'Khởi tạo hợp đồng'
        }
      ],
      currentVersion: 1,
      approvalSteps: [],
      currentStep: 0,
      reminders: [],
      createdBy: authState.user?.email || 'unknown',
      createdManually: true
    } as Contract;

    setContracts([newContract, ...contracts]);
    setShowManualCreator(false);
  };

  const getDashboardStats = (): DashboardStats => {
    return {
      totalContracts: contracts.length,
      pendingApproval: contracts.filter(c => c.status === 'pending').length,
      approved: contracts.filter(c => c.status === 'approved').length,
      rejected: contracts.filter(c => c.status === 'rejected').length,
      expiringSoon: contracts.filter(c => {
        if (!c.expiryDate) return false;
        const expiryDate = new Date(c.expiryDate);
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        return expiryDate <= thirtyDaysFromNow;
      }).length,
      averageProcessingTime: 3.5,
      approvalRate: 85,
      monthlyUploads: [12, 19, 15, 22, 18, 25, 20, 16, 23, 28, 21, 19],
      rejectionReasons: [
        { reason: 'Thiếu thông tin pháp lý', count: 5 },
        { reason: 'Giá trị không phù hợp', count: 3 },
        { reason: 'Điều khoản chưa rõ ràng', count: 2 }
      ]
    };
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || contract.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingUsers = users.filter(u => !u.isApproved);

  const menuItems = [
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'analytics', label: 'Thống kê', icon: BarChart3, requiresPermission: 'canViewAnalytics' },
    { id: 'users', label: 'Quản lý người dùng', icon: Users, requiresPermission: 'canManageUsers' },
    { id: 'help', label: 'Hướng dẫn', icon: HelpCircle }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'signed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'pending': return 'Chờ duyệt';
      case 'rejected': return 'Từ chối';
      case 'draft': return 'Nháp';
      case 'signed': return 'Đã ký';
      case 'expired': return 'Hết hạn';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Khẩn cấp';
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ContractFlow</h1>
            <p className="text-gray-600">Hệ thống quản lý và phê duyệt hợp đồng</p>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Đăng nhập / Đăng ký
          </button>
        </div>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ContractFlow</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const hasPermission = !item.requiresPermission || 
              (authState.user?.permissions as any)?.[item.requiresPermission];
            
            if (!hasPermission) return null;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                  if (item.id === 'analytics') {
                    setShowDetailedAnalytics(false);
                  }
                }}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">
                {authState.user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{authState.user?.name}</p>
              <p className="text-sm text-gray-500">{authState.user?.position}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                {activeTab === 'contracts' && 'Quản lý hợp đồng'}
                {activeTab === 'analytics' && 'Thống kê và báo cáo'}
                {activeTab === 'users' && 'Quản lý người dùng'}
                {activeTab === 'help' && 'Hướng dẫn sử dụng'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {pendingUsers.length > 0 && authState.user?.permissions.canApproveUsers && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-400" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {pendingUsers.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              {/* User Approval Panel */}
              {pendingUsers.length > 0 && authState.user?.permissions.canApproveUsers && (
                <UserApprovalPanel
                  pendingUsers={pendingUsers}
                  currentUser={authState.user}
                  onApproveUser={handleApproveUser}
                  onRejectUser={handleRejectUser}
                />
              )}

              {/* Filters and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm hợp đồng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="draft">Nháp</option>
                    <option value="pending">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="rejected">Từ chối</option>
                    <option value="signed">Đã ký</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả mức độ</option>
                    <option value="urgent">Khẩn cấp</option>
                    <option value="high">Cao</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  {authState.user?.permissions.canCreateManual && (
                    <button
                      onClick={() => setShowManualCreator(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tạo thủ công</span>
                    </button>
                  )}
                  {authState.user?.permissions.canUpload && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Tải lên hợp đồng</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Contracts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContracts.map((contract) => (
                  <div
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{contract.title}</h3>
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(contract.status)}`}>
                          {getStatusText(contract.status)}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(contract.priority)}`}>
                          {getPriorityText(contract.priority)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{contract.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Tải lên: {new Date(contract.uploadDate).toLocaleDateString('vi-VN')}</span>
                      {contract.contractValue && (
                        <span className="font-medium">
                          {new Intl.NumberFormat('vi-VN').format(contract.contractValue)} {contract.currency}
                        </span>
                      )}
                    </div>
                    {contract.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {contract.tags.slice(0, 2).map(tag => (
                          <span key={tag.id} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {tag.name}
                          </span>
                        ))}
                        {contract.tags.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{contract.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredContracts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy hợp đồng</h3>
                  <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tải lên hợp đồng mới</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              {showDetailedAnalytics ? (
                <DetailedAnalytics
                  stats={getDashboardStats()}
                  contracts={contracts}
                  onBack={() => setShowDetailedAnalytics(false)}
                  onContractClick={setSelectedContract}
                />
              ) : (
                <div className="space-y-6">
                  <AdvancedDashboard
                    stats={getDashboardStats()}
                    onMetricClick={(metric) => setShowDetailedAnalytics(true)}
                    onChartClick={(data, type) => setShowDetailedAnalytics(true)}
                  />
                  <TimeBasedAnalytics
                    contracts={contracts}
                    onContractClick={setSelectedContract}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'users' && authState.user?.permissions.canManageUsers && (
            <UserManagement
              users={users}
              currentUser={authState.user}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === 'help' && <HelpGuide />}
        </main>
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{selectedContract.title}</h2>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Contract Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Thông tin hợp đồng</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Trạng thái:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedContract.status)}`}>
                          {getStatusText(selectedContract.status)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Mức độ:</span>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedContract.priority)}`}>
                          {getPriorityText(selectedContract.priority)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Ngày tải lên:</span>
                        <span className="ml-2 text-gray-900">{new Date(selectedContract.uploadDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {selectedContract.contractValue && (
                        <div>
                          <span className="text-gray-500">Giá trị:</span>
                          <span className="ml-2 text-gray-900 font-medium">
                            {new Intl.NumberFormat('vi-VN').format(selectedContract.contractValue)} {selectedContract.currency}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Extracted Info */}
                  {selectedContract.extractedInfo && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Thông tin trích xuất</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Loại hợp đồng:</span>
                          <p className="text-gray-900">{selectedContract.extractedInfo.contractType}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Các bên tham gia:</span>
                          <ul className="list-disc list-inside text-gray-900">
                            {selectedContract.extractedInfo.parties.map((party, index) => (
                              <li key={index}>{party}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Thời hạn:</span>
                          <p className="text-gray-900">{selectedContract.extractedInfo.duration}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Tóm tắt:</span>
                          <p className="text-gray-900">{selectedContract.extractedInfo.summary}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Multi-step Approval */}
                  {selectedContract.approvalSteps.length > 0 && (
                    <MultiStepApproval
                      steps={selectedContract.approvalSteps}
                      currentStep={selectedContract.currentStep}
                      onApprove={handleApproveStep}
                      onReject={handleRejectStep}
                      canApprove={authState.user?.permissions.canApprove || false}
                    />
                  )}

                  {/* Hierarchy Approval Flow */}
                  <HierarchyApprovalFlow
                    contract={selectedContract}
                    users={users}
                    onUpdateApprovalFlow={handleUpdateApprovalFlow}
                  />
                </div>

                <div className="space-y-6">
                  {/* Actions */}
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Hành động</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowContractEditor(true)}
                        className="w-full px-4 py-2 text-left text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Chỉnh sửa hợp đồng
                      </button>
                      <button
                        onClick={() => setShowVersionHistory(true)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        Xem lịch sử phiên bản
                      </button>
                    </div>
                  </div>

                  {/* Contract Comments */}
                  <ContractComments
                    comments={[]}
                    onAddComment={(content, highlightedText) => handleAddComment(selectedContract.id, content, highlightedText)}
                    onDeleteComment={handleDeleteComment}
                    onResolveComment={handleResolveComment}
                  />

                  {/* Contract Reminders */}
                  <ContractReminders
                    contract={selectedContract}
                    onAddReminder={(reminder) => handleAddReminder(selectedContract.id, reminder)}
                    onDeleteReminder={handleDeleteReminder}
                  />

                  {/* E-Signature Panel */}
                  <ESignaturePanel
                    contract={selectedContract}
                    availableSigners={users}
                    onSendForSignature={(signers, provider) => handleSendForSignature(selectedContract.id, signers, provider)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Editor Modal */}
      {showContractEditor && selectedContract && (
        <ContractEditor
          contract={selectedContract}
          availableTags={mockTags}
          onSave={handleContractSave}
          onClose={() => setShowContractEditor(false)}
          canEdit={true}
        />
      )}

      {/* Version History Modal */}
      {showVersionHistory && selectedContract && (
        <AdvancedVersionHistory
          contract={selectedContract}
          onVersionSelect={handleVersionSelect}
          onCompareVersions={handleCompareVersions}
          onRestoreVersion={(versionId) => console.log('Restore version:', versionId)}
        />
      )}

      {/* Version Comparison Modal */}
      {showVersionComparison && comparisonVersions && (
        <VersionComparison
          version1={comparisonVersions.v1}
          version2={comparisonVersions.v2}
          onClose={() => setShowVersionComparison(false)}
        />
      )}

      {/* Manual Contract Creator */}
      {showManualCreator && (
        <ManualContractCreator
          availableTags={mockTags}
          onSave={handleManualContractSave}
          onClose={() => setShowManualCreator(false)}
        />
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tải lên hợp đồng</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center py-8">
              <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tính năng tải lên sẽ được triển khai sau</p>
            </div>
            <button
              onClick={() => setShowUploadModal(false)}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;