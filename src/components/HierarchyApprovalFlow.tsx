import React, { useState } from 'react';
import { Users, ArrowUp, DollarSign, Shield, AlertTriangle } from 'lucide-react';
import { Contract, ApprovalStep } from '../types/contract';
import { User } from '../types/user';

interface HierarchyApprovalFlowProps {
  contract: Contract;
  users: User[];
  onUpdateApprovalFlow: (contractId: string, steps: ApprovalStep[]) => void;
}

export const HierarchyApprovalFlow: React.FC<HierarchyApprovalFlowProps> = ({
  contract,
  users,
  onUpdateApprovalFlow
}) => {
  const [showFlowBuilder, setShowFlowBuilder] = useState(false);

  const getRequiredApprovers = (contractValue?: number) => {
    const value = contractValue || contract.extractedInfo?.numericValue || 0;
    
    // Định nghĩa ngưỡng phê duyệt theo giá trị hợp đồng
    const approvalThresholds = [
      { level: 2, role: 'manager', maxValue: 50000000, title: 'Quản lý' }, // 50M VND
      { level: 3, role: 'director', maxValue: 200000000, title: 'Giám đốc' }, // 200M VND
      { level: 4, role: 'ceo', maxValue: Infinity, title: 'Tổng giám đốc' }
    ];

    const requiredLevels = [];
    
    // Xác định cấp độ phê duyệt cần thiết dựa trên giá trị
    if (value > 10000000) { // > 10M VND cần Manager
      requiredLevels.push(approvalThresholds[0]);
    }
    if (value > 50000000) { // > 50M VND cần Director
      requiredLevels.push(approvalThresholds[1]);
    }
    if (value > 200000000) { // > 200M VND cần CEO
      requiredLevels.push(approvalThresholds[2]);
    }
    
    // Luôn cần pháp chế cho hợp đồng quan trọng
    const needsLegal = value > 20000000 || contract.priority === 'high' || contract.priority === 'urgent';
    
    // Luôn cần tài chính cho hợp đồng có giá trị
    const needsFinance = value > 30000000 || contract.priority === 'high' || contract.priority === 'urgent';
    
    const steps: ApprovalStep[] = [];
    let stepNumber = 1;

    // Bước 1: Quản lý trực tiếp (nếu cần)
    if (value > 10000000) {
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Quản lý phòng ban',
        requiredHierarchyLevel: 2,
        contractValueThreshold: 50000000,
        status: 'pending'
      });
    }

    // Bước 2: Pháp chế (nếu cần)
    if (needsLegal) {
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Phòng Pháp chế',
        requiredHierarchyLevel: 2,
        status: 'pending'
      });
    }

    // Bước 3: Tài chính (nếu cần)
    if (needsFinance) {
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Phòng Tài chính',
        requiredHierarchyLevel: 2,
        status: 'pending'
      });
    }

    // Bước 4: Giám đốc (nếu cần) 
    if (value > 50000000) {
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Giám đốc',
        requiredHierarchyLevel: 3,
        contractValueThreshold: 200000000,
        status: 'pending'
      });
    }

    // Bước 5: Tổng giám đốc (nếu cần)
    if (value > 200000000) {
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber: stepNumber++,
        approverRole: 'Tổng giám đốc',
        requiredHierarchyLevel: 4,
        contractValueThreshold: Infinity,
        status: 'pending'
      });
    }

    return steps;
  };

  const getAvailableApprovers = (requiredLevel: number, role?: string) => {
    return users.filter(user => 
      user.isActive && 
      user.isApproved && 
      user.permissions.canApprove &&
      (user.hierarchyLevel >= requiredLevel || (role && user.role === role))
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const handleGenerateFlow = () => {
    const newSteps = getRequiredApprovers();
    onUpdateApprovalFlow(contract.id, newSteps);
    setShowFlowBuilder(false);
  };

  const contractValue = contract.extractedInfo?.numericValue || 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Luồng phê duyệt phân cấp</h3>
          </div>
          <button
            onClick={() => setShowFlowBuilder(!showFlowBuilder)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tạo luồng tự động
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Contract Value Analysis */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Phân tích giá trị hợp đồng</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Giá trị:</span>
              <div className="font-medium text-blue-900">
                {contractValue > 0 ? formatCurrency(contractValue) : 'Chưa xác định'}
              </div>
            </div>
            <div>
              <span className="text-blue-700">Mức độ ưu tiên:</span>
              <div className="font-medium text-blue-900 capitalize">{contract.priority}</div>
            </div>
            <div>
              <span className="text-blue-700">Luồng phê duyệt:</span>
              <div className="font-medium text-blue-900">
                {getRequiredApprovers().length} bước
              </div>
            </div>
          </div>
        </div>

        {/* Approval Thresholds */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Ngưỡng phê duyệt</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-green-800">Quản lý phòng ban</span>
              </div>
              <span className="text-green-700 text-sm">≤ 50.000.000 VND</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span className="text-amber-800">Giám đốc</span>
              </div>
              <span className="text-amber-700 text-sm">≤ 200.000.000 VND</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-red-800">Tổng giám đốc</span>
              </div>
              <span className="text-red-700 text-sm">Lớn hơn 200.000.000 VND</span>
            </div>
          </div>
        </div>

        {/* Current Approval Steps */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Luồng phê duyệt hiện tại</h4>
          {contract.approvalSteps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chưa có luồng phê duyệt. Nhấp "Tạo luồng tự động" để tạo.</p>
            </div>
          ) : (
            contract.approvalSteps.map((step, index) => {
              const availableApprovers = getAvailableApprovers(step.requiredHierarchyLevel);
              
              return (
                <div key={step.id} className="relative">
                  {index < contract.approvalSteps.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-12 bg-gray-200"></div>
                  )}
                  
                  <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        step.status === 'approved' ? 'bg-green-100 text-green-600' :
                        step.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        index === contract.currentStep ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-400'
                      }`}>
                        {step.stepNumber}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{step.approverRole}</h5>
                        <div className="flex items-center space-x-2">
                          {step.contractValueThreshold && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              ≤ {formatCurrency(step.contractValueThreshold)}
                            </span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded ${
                            step.status === 'approved' ? 'bg-green-100 text-green-800' :
                            step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {step.status === 'approved' ? 'Đã duyệt' :
                             step.status === 'rejected' ? 'Từ chối' :
                             step.status === 'pending' ? 'Chờ duyệt' : 'Bỏ qua'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        Yêu cầu cấp độ: {step.requiredHierarchyLevel} | 
                        Người có thể duyệt: {availableApprovers.length}
                      </div>
                      
                      {step.approverName && (
                        <div className="text-sm text-gray-700">
                          <strong>Người duyệt:</strong> {step.approverName}
                          {step.approvedAt && (
                            <span className="ml-2 text-gray-500">
                              ({new Date(step.approvedAt).toLocaleString('vi-VN')})
                            </span>
                          )}
                        </div>
                      )}
                      
                      {step.comments && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                          {step.comments}
                        </div>
                      )}
                      
                      {step.timeSpent && (
                        <div className="text-xs text-gray-500 mt-1">
                          Thời gian xử lý: {step.timeSpent} phút
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Flow Builder */}
        {showFlowBuilder && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-4">Tạo luồng phê duyệt tự động</h4>
            <div className="space-y-3">
              {getRequiredApprovers().map((step, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {step.stepNumber}
                    </span>
                    <span className="font-medium">{step.approverRole}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Cấp độ {step.requiredHierarchyLevel}
                    {step.contractValueThreshold && step.contractValueThreshold !== Infinity && (
                      <span className="ml-2">
                        (≤ {formatCurrency(step.contractValueThreshold)})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleGenerateFlow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Áp dụng luồng
              </button>
              <button
                onClick={() => setShowFlowBuilder(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};