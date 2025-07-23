import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Clock, Filter, Download } from 'lucide-react';
import { Contract } from '../types/contract';

interface TimeBasedAnalyticsProps {
  contracts: Contract[];
  onContractClick: (contract: Contract) => void;
}

export const TimeBasedAnalytics: React.FC<TimeBasedAnalyticsProps> = ({
  contracts,
  onContractClick
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedRejectionReason, setSelectedRejectionReason] = useState<string | null>(null);

  const getDateRange = () => {
    const now = new Date();
    const ranges = {
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    };
    return ranges[timeRange];
  };

  const filteredContracts = contracts.filter(contract => {
    const contractDate = new Date(contract.uploadDate);
    return contractDate >= getDateRange();
  });

  // Thống kê theo ngày
  const getDailyStats = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const dailyStats = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayContracts = filteredContracts.filter(c => 
        c.uploadDate.startsWith(dateStr)
      );
      
      dailyStats.push({
        date: dateStr,
        displayDate: date.toLocaleDateString('vi-VN', { 
          month: 'short', 
          day: 'numeric' 
        }),
        total: dayContracts.length,
        approved: dayContracts.filter(c => c.status === 'approved').length,
        rejected: dayContracts.filter(c => c.status === 'rejected').length,
        pending: dayContracts.filter(c => c.status === 'pending').length
      });
    }
    
    return dailyStats;
  };

  // Thống kê lý do từ chối
  const getRejectionReasons = () => {
    const rejectedContracts = filteredContracts.filter(c => c.status === 'rejected');
    const reasonCounts: { [key: string]: { count: number; contracts: Contract[] } } = {};
    
    rejectedContracts.forEach(contract => {
      const reason = contract.rejectionReason || 'Không rõ lý do';
      if (!reasonCounts[reason]) {
        reasonCounts[reason] = { count: 0, contracts: [] };
      }
      reasonCounts[reason].count++;
      reasonCounts[reason].contracts.push(contract);
    });
    
    return Object.entries(reasonCounts)
      .map(([reason, data]) => ({
        reason,
        count: data.count,
        contracts: data.contracts,
        percentage: (data.count / rejectedContracts.length * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count);
  };

  // Thống kê thời gian xử lý
  const getProcessingTimeStats = () => {
    const processedContracts = filteredContracts.filter(c => 
      c.status === 'approved' || c.status === 'rejected'
    );
    
    const timeStats = processedContracts.map(contract => {
      const uploadDate = new Date(contract.uploadDate);
      const reviewDate = new Date(contract.reviewDate || contract.uploadDate);
      const processingTime = Math.ceil((reviewDate.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        contractId: contract.id,
        title: contract.title,
        processingTime,
        status: contract.status,
        reviewer: contract.reviewer
      };
    });
    
    return timeStats.sort((a, b) => b.processingTime - a.processingTime);
  };

  const dailyStats = getDailyStats();
  const rejectionReasons = getRejectionReasons();
  const processingTimeStats = getProcessingTimeStats();

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Thống kê theo thời gian</h2>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="90d">90 ngày qua</option>
            <option value="1y">1 năm qua</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Daily Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng hợp đồng theo ngày</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="displayDate" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#3B82F6" name="Tổng số" strokeWidth={2} />
            <Line type="monotone" dataKey="approved" stroke="#10B981" name="Đã duyệt" strokeWidth={2} />
            <Line type="monotone" dataKey="rejected" stroke="#EF4444" name="Từ chối" strokeWidth={2} />
            <Line type="monotone" dataKey="pending" stroke="#F59E0B" name="Chờ duyệt" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rejection Reasons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lý do từ chối (Nhấp để xem chi tiết)
          </h3>
          {rejectionReasons.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Không có hợp đồng bị từ chối trong khoảng thời gian này</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rejectionReasons.map((item, index) => (
                <div key={item.reason}>
                  <div
                    onClick={() => setSelectedRejectionReason(
                      selectedRejectionReason === item.reason ? null : item.reason
                    )}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="font-medium text-gray-900">{item.reason}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">{item.count}</div>
                      <div className="text-sm text-gray-500">{item.percentage}%</div>
                    </div>
                  </div>
                  
                  {selectedRejectionReason === item.reason && (
                    <div className="mt-2 ml-7 space-y-2">
                      {item.contracts.map(contract => (
                        <div
                          key={contract.id}
                          onClick={() => onContractClick(contract)}
                          className="p-3 bg-gray-50 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                          <div className="font-medium text-gray-900">{contract.title}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            Từ chối: {new Date(contract.reviewDate || contract.uploadDate).toLocaleDateString('vi-VN')}
                            {contract.reviewer && <span> • Bởi: {contract.reviewer}</span>}
                          </div>
                          {contract.comments && (
                            <div className="text-sm text-gray-600 mt-1 italic">
                              "{contract.comments}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Processing Time Analysis */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thời gian xử lý</h3>
          {processingTimeStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Không có dữ liệu thời gian xử lý</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(processingTimeStats.reduce((sum, item) => sum + item.processingTime, 0) / processingTimeStats.length)}
                  </div>
                  <div className="text-sm text-blue-600">Trung bình (ngày)</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.min(...processingTimeStats.map(item => item.processingTime))}
                  </div>
                  <div className="text-sm text-green-600">Nhanh nhất (ngày)</div>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.max(...processingTimeStats.map(item => item.processingTime))}
                  </div>
                  <div className="text-sm text-red-600">Chậm nhất (ngày)</div>
                </div>
              </div>
              
              <div className="max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {processingTimeStats.slice(0, 10).map(item => (
                    <div
                      key={item.contractId}
                      className="flex items-center justify-between p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        const contract = contracts.find(c => c.id === item.contractId);
                        if (contract) onContractClick(contract);
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                        <div className="text-xs text-gray-500">
                          {item.reviewer && `Duyệt bởi: ${item.reviewer}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${
                          item.processingTime <= 3 ? 'text-green-600' :
                          item.processingTime <= 7 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {item.processingTime} ngày
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};