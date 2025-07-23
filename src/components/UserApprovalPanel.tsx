import React, { useState } from 'react';
import { UserCheck, UserX, Clock, Shield, CheckCircle, XCircle } from 'lucide-react';
import { User } from '../types/user';

interface UserApprovalPanelProps {
  pendingUsers: User[];
  currentUser: User;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string, reason: string) => void;
}

export const UserApprovalPanel: React.FC<UserApprovalPanelProps> = ({
  pendingUsers,
  currentUser,
  onApproveUser,
  onRejectUser
}) => {
  const [rejectingUser, setRejectingUser] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = (userId: string) => {
    if (rejectReason.trim()) {
      onRejectUser(userId, rejectReason);
      setRejectingUser(null);
      setRejectReason('');
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'employee': return 'Nhân viên';
      case 'manager': return 'Quản lý';
      case 'director': return 'Giám đốc';
      case 'ceo': return 'Tổng giám đốc';
      case 'admin': return 'Quản trị viên';
      case 'legal': return 'Pháp chế';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'manager': return 'bg-green-100 text-green-800';
      case 'director': return 'bg-purple-100 text-purple-800';
      case 'ceo': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-gray-100 text-gray-800';
      case 'legal': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser.permissions.canApproveUsers) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Phê duyệt tài khoản ({pendingUsers.length})
          </h3>
        </div>
      </div>

      <div className="p-6">
        {pendingUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Không có tài khoản nào cần phê duyệt</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map(user => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleText(user.role)}
                        </span>
                        <span className="text-xs text-gray-400">
                          {user.department} • {user.position}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Đăng ký: {new Date(user.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {rejectingUser === user.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Lý do từ chối..."
                          className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleReject(user.id)}
                          disabled={!rejectReason.trim()}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:bg-gray-300"
                        >
                          Từ chối
                        </button>
                        <button
                          onClick={() => setRejectingUser(null)}
                          className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onApproveUser(user.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Phê duyệt</span>
                        </button>
                        <button
                          onClick={() => setRejectingUser(user.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Từ chối</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};