import React, { useState } from 'react';
import { Save, X, FileText, Plus, Trash2 } from 'lucide-react';
import { Contract, ContractTag } from '../types/contract';

interface ManualContractCreatorProps {
  availableTags: ContractTag[];
  onSave: (contractData: Partial<Contract>) => void;
  onClose: () => void;
}

export const ManualContractCreator: React.FC<ManualContractCreatorProps> = ({
  availableTags,
  onSave,
  onClose
}) => {
  const [contractData, setContractData] = useState({
    title: '',
    description: '',
    contractValue: '',
    currency: 'VND',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    tags: [] as ContractTag[],
    extractedInfo: {
      contractType: '',
      parties: [''],
      value: '',
      duration: '',
      summary: '',
      fullText: '',
      contractNumber: '',
      signDate: '',
      effectiveDate: '',
      expirationDate: '',
      purpose: '',
      paymentMethod: '',
      paymentSchedule: '',
      warrantyInfo: '',
      penaltyClause: '',
      disputeResolution: '',
      attachments: [''],
      currentStatus: 'draft',
      paymentProgress: 0,
      responsiblePerson: '',
      specialNotes: ''
    }
  });

  const handleSave = () => {
    const contract: Partial<Contract> = {
      ...contractData,
      contractValue: parseFloat(contractData.contractValue) || 0,
      extractedInfo: {
        ...contractData.extractedInfo,
        parties: contractData.extractedInfo.parties.filter(p => p.trim()),
        attachments: contractData.extractedInfo.attachments?.filter(a => a.trim()),
        numericValue: parseFloat(contractData.contractValue) || 0
      },
      createdManually: true
    };
    onSave(contract);
    onClose();
  };

  const addParty = () => {
    setContractData({
      ...contractData,
      extractedInfo: {
        ...contractData.extractedInfo,
        parties: [...contractData.extractedInfo.parties, '']
      }
    });
  };

  const updateParty = (index: number, value: string) => {
    const newParties = [...contractData.extractedInfo.parties];
    newParties[index] = value;
    setContractData({
      ...contractData,
      extractedInfo: {
        ...contractData.extractedInfo,
        parties: newParties
      }
    });
  };

  const removeParty = (index: number) => {
    setContractData({
      ...contractData,
      extractedInfo: {
        ...contractData.extractedInfo,
        parties: contractData.extractedInfo.parties.filter((_, i) => i !== index)
      }
    });
  };

  const addAttachment = () => {
    setContractData({
      ...contractData,
      extractedInfo: {
        ...contractData.extractedInfo,
        attachments: [...(contractData.extractedInfo.attachments || []), '']
      }
    });
  };

  const updateAttachment = (index: number, value: string) => {
    const newAttachments = [...(contractData.extractedInfo.attachments || [])];
    newAttachments[index] = value;
    setContractData({
      ...contractData,
      extractedInfo: {
        ...contractData.extractedInfo,
        attachments: newAttachments
      }
    });
  };

  const removeAttachment = (index: number) => {
    setContractData({
      ...contractData,
      extractedInfo: {
        ...contractData.extractedInfo,
        attachments: contractData.extractedInfo.attachments?.filter((_, i) => i !== index)
      }
    });
  };

  const handleAddTag = (tag: ContractTag) => {
    if (!contractData.tags.find(t => t.id === tag.id)) {
      setContractData({
        ...contractData,
        tags: [...contractData.tags, tag]
      });
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setContractData({
      ...contractData,
      tags: contractData.tags.filter(t => t.id !== tagId)
    });
  };

  const getTagColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      indigo: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      gray: 'bg-gray-100 text-gray-800 border-gray-200',
      red: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Tạo hợp đồng thủ công</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* 1. Thông tin chung */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">📝 1. Thông tin chung</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên hợp đồng *</label>
                <input
                  type="text"
                  required
                  value={contractData.title}
                  onChange={(e) => setContractData({ ...contractData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Hợp đồng cung cấp dịch vụ phần mềm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số/Mã hợp đồng</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.contractNumber}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, contractNumber: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày ký</label>
                <input
                  type="date"
                  value={contractData.extractedInfo.signDate}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, signDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hiệu lực từ</label>
                <input
                  type="date"
                  value={contractData.extractedInfo.effectiveDate}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, effectiveDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hiệu lực đến</label>
                <input
                  type="date"
                  value={contractData.extractedInfo.expirationDate}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, expirationDate: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Các bên tham gia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Các bên tham gia</label>
              <div className="space-y-2">
                {contractData.extractedInfo.parties.map((party, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={party}
                      onChange={(e) => updateParty(index, e.target.value)}
                      placeholder={`Bên ${String.fromCharCode(65 + index)}: Tên công ty/cá nhân, địa chỉ, đại diện`}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeParty(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addParty}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm bên tham gia</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Mục đích hợp đồng */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">💼 2. Mục đích hợp đồng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loại hợp đồng</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.contractType}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, contractType: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Hợp đồng cung cấp dịch vụ"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
                <select
                  value={contractData.priority}
                  onChange={(e) => setContractData({ ...contractData, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mục đích chi tiết</label>
              <textarea
                value={contractData.extractedInfo.purpose}
                onChange={(e) => setContractData({
                  ...contractData,
                  extractedInfo: { ...contractData.extractedInfo, purpose: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả ngắn gọn mục tiêu hoặc nội dung chính của hợp đồng"
              />
            </div>
          </div>

          {/* 3. Giá trị hợp đồng và thanh toán */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">💰 3. Giá trị hợp đồng và thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tổng giá trị</label>
                <input
                  type="number"
                  value={contractData.contractValue}
                  onChange={(e) => setContractData({ ...contractData, contractValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đơn vị tiền tệ</label>
                <select
                  value={contractData.currency}
                  onChange={(e) => setContractData({ ...contractData, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="VND">VND</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiến độ thanh toán (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={contractData.extractedInfo.paymentProgress}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, paymentProgress: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.paymentMethod}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, paymentMethod: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Chuyển khoản, tiền mặt"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lịch thanh toán</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.paymentSchedule}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, paymentSchedule: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Theo tiến độ, hàng tháng, 1 lần"
                />
              </div>
            </div>
          </div>

          {/* 4. Thời gian và tiến độ */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">⏱️ 4. Thời gian và tiến độ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời hạn hợp đồng</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.duration}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, duration: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: 12 tháng, 2 năm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Người phụ trách</label>
                <input
                  type="text"
                  value={contractData.extractedInfo.responsiblePerson}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, responsiblePerson: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 5. Điều khoản quan trọng */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">🛡️ 5. Điều khoản quan trọng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bảo hành</label>
                <textarea
                  value={contractData.extractedInfo.warrantyInfo}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, warrantyInfo: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phạt vi phạm</label>
                <textarea
                  value={contractData.extractedInfo.penaltyClause}
                  onChange={(e) => setContractData({
                    ...contractData,
                    extractedInfo: { ...contractData.extractedInfo, penaltyClause: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giải quyết tranh chấp</label>
              <textarea
                value={contractData.extractedInfo.disputeResolution}
                onChange={(e) => setContractData({
                  ...contractData,
                  extractedInfo: { ...contractData.extractedInfo, disputeResolution: e.target.value }
                })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="VD: Tòa án, Trọng tài thương mại, địa điểm xử lý"
              />
            </div>
          </div>

          {/* 6. Phụ lục và tài liệu */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">📎 6. Phụ lục và tài liệu đính kèm</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh sách phụ lục</label>
              <div className="space-y-2">
                {contractData.extractedInfo.attachments?.map((attachment, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={attachment}
                      onChange={(e) => updateAttachment(index, e.target.value)}
                      placeholder="VD: Bảng báo giá, sơ đồ thiết kế..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => removeAttachment(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addAttachment}
                  className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm phụ lục</span>
                </button>
              </div>
            </div>
          </div>

          {/* 7. Tóm tắt và ghi chú */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">📝 7. Tóm tắt và ghi chú</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả tổng quan</label>
              <textarea
                value={contractData.description}
                onChange={(e) => setContractData({ ...contractData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt chi tiết</label>
              <textarea
                value={contractData.extractedInfo.summary}
                onChange={(e) => setContractData({
                  ...contractData,
                  extractedInfo: { ...contractData.extractedInfo, summary: e.target.value }
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đặc biệt</label>
              <textarea
                value={contractData.extractedInfo.specialNotes}
                onChange={(e) => setContractData({
                  ...contractData,
                  extractedInfo: { ...contractData.extractedInfo, specialNotes: e.target.value }
                })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Điều khoản bất lợi, ràng buộc khắt khe..."
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">🏷️ Tags</h3>
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {contractData.tags.map(tag => (
                  <span
                    key={tag.id}
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${getTagColor(tag.color)} cursor-pointer`}
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    {tag.name} ×
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !contractData.tags.find(t => t.id === tag.id))
                  .map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag)}
                      className={`px-3 py-1 text-sm font-medium rounded-full border border-dashed hover:bg-opacity-50 ${getTagColor(tag.color)}`}
                    >
                      + {tag.name}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Tạo hợp đồng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};