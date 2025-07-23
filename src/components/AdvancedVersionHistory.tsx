import React, { useState } from 'react';
import { Clock, User, FileText, Eye, GitBranch, Download, GitCompare as Compare, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Contract, ContractVersion } from '../types/contract';

interface AdvancedVersionHistoryProps {
  contract: Contract;
  onVersionSelect: (version: ContractVersion) => void;
  onCompareVersions: (v1: ContractVersion, v2: ContractVersion) => void;
  onRestoreVersion: (versionId: string) => void;
}

export const AdvancedVersionHistory: React.FC<AdvancedVersionHistoryProps> = ({
  contract,
  onVersionSelect,
  onCompareVersions,
  onRestoreVersion
}) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleVersionCheck = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter(id => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const handleCompare = () => {
    if (selectedVersions.length === 2) {
      const v1 = contract.versions.find(v => v.id === selectedVersions[0]);
      const v2 = contract.versions.find(v => v.id === selectedVersions[1]);
      if (v1 && v2) {
        onCompareVersions(v1, v2);
      }
    }
  };

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'created': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'edited': return <Eye className="w-4 h-4 text-amber-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'signed': return <FileText className="w-4 h-4 text-purple-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getChangeTypeText = (changeType: string) => {
    switch (changeType) {
      case 'created': return 'Tạo mới';
      case 'edited': return 'Chỉnh sửa';
      case 'approved': return 'Phê duyệt';
      case 'rejected': return 'Từ chối';
      case 'signed': return 'Ký hợp đồng';
      default: return changeType;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Lịch sử phiên bản chi tiết</h3>
          </div>
          <div className="flex items-center space-x-2">
            {selectedVersions.length === 2 && (
              <button
                onClick={handleCompare}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Compare className="w-4 h-4" />
                <span>So sánh</span>
              </button>
            )}
            <span className="text-sm text-gray-500">
              {selectedVersions.length}/2 phiên bản được chọn
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {contract.versions.map((version, index) => (
            <div
              key={version.id}
              className={`border rounded-lg p-4 transition-all ${
                version.version === contract.currentVersion
                  ? 'border-blue-200 bg-blue-50'
                  : selectedVersions.includes(version.id)
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedVersions.includes(version.id)}
                    onChange={() => handleVersionCheck(version.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getChangeTypeIcon(version.changeType)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            Phiên bản {version.version}
                          </span>
                          {version.version === contract.currentVersion && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Hiện tại
                            </span>
                          )}
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {getChangeTypeText(version.changeType)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{version.title}</p>
                      </div>
                    </div>

                    {version.changes && (
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Thay đổi:</strong> {version.changes}
                      </p>
                    )}
                    
                    {version.changeDescription && (
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Mô tả:</strong> {version.changeDescription}
                      </p>
                    )}
                    
                    {version.changeReason && (
                      <p className="text-sm text-gray-500 mb-2">
                        <strong>Lý do:</strong> {version.changeReason}
                      </p>
                    )}

                    {version.changedFields && version.changedFields.length > 0 && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-500 mb-1">
                          <strong>Trường đã thay đổi:</strong>
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {version.changedFields.map(field => (
                            <span key={field} className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{version.createdBy}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(version.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                      {version.fileSize && (
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{formatFileSize(version.fileSize)}</span>
                        </div>
                      )}
                      {version.checksum && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">Checksum: {version.checksum.substring(0, 8)}...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowDetails(showDetails === version.id ? null : version.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onVersionSelect(version)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    title="Xem nội dung"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  {version.version !== contract.currentVersion && (
                    <button
                      onClick={() => onRestoreVersion(version.id)}
                      className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-100"
                      title="Khôi phục phiên bản này"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {showDetails === version.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Chi tiết phiên bản</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>ID:</strong> {version.id}
                    </div>
                    <div>
                      <strong>Vai trò người tạo:</strong> {version.createdByRole}
                    </div>
                    {version.previousVersion && (
                      <div>
                        <strong>Phiên bản trước:</strong> {version.previousVersion}
                      </div>
                    )}
                    {version.checksum && (
                      <div>
                        <strong>Checksum:</strong> 
                        <code className="ml-1 text-xs bg-gray-200 px-1 rounded">{version.checksum}</code>
                      </div>
                    )}
                    {version.changeReason && (
                      <div className="md:col-span-2">
                        <strong>Lý do thay đổi:</strong> {version.changeReason}
                      </div>
                    )}
                    {version.changeDescription && (
                      <div className="md:col-span-2">
                        <strong>Mô tả chi tiết:</strong> {version.changeDescription}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <strong>Nội dung:</strong>
                    <div className="mt-1 p-2 bg-white border rounded text-xs max-h-32 overflow-y-auto">
                      {version.content.substring(0, 500)}
                      {version.content.length > 500 && '...'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};