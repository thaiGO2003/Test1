import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { DashboardStats } from '../types/contract';

interface AdvancedDashboardProps {
  stats: DashboardStats;
  onMetricClick: (metric: string) => void;
  onChartClick: (data: any, type: string) => void;
}

export const AdvancedDashboard: React.FC<AdvancedDashboardProps> = ({ stats, onMetricClick, onChartClick }) => {
  const monthlyData = stats.monthlyUploads.map((count, index) => ({
    month: `Tháng ${index + 1}`,
    uploads: count,
    monthIndex: index
  }));

  const statusData = [
    { name: 'Đã duyệt', value: stats.approved, color: '#10B981' },
    { name: 'Chờ duyệt', value: stats.pendingApproval, color: '#F59E0B' },
    { name: 'Từ chối', value: stats.rejected, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => onMetricClick('total')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng hợp đồng</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalContracts}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Nhấp để xem chi tiết</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onMetricClick('approved')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tỷ lệ phê duyệt</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.approvalRate}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Nhấp để xem chi tiết</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onMetricClick('processing-time')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Thời gian xử lý TB</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.averageProcessingTime} ngày</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">Nhấp để xem chi tiết</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div 
          onClick={() => onMetricClick('expiring')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sắp hết hạn</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.expiringSoon}</p>
              <div className="flex items-center mt-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">Nhấp để xem chi tiết</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Uploads Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hợp đồng tải lên theo tháng
            <span className="text-sm font-normal text-gray-500 ml-2">(Nhấp vào cột để xem chi tiết)</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="uploads" 
                stroke="#3B82F6" 
                strokeWidth={2}
                onClick={(data) => onChartClick(data, 'monthly')}
                style={{ cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phân bố trạng thái
            <span className="text-sm font-normal text-gray-500 ml-2">(Nhấp vào phần để xem chi tiết)</span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={(data) => onChartClick(data, 'status')}
                style={{ cursor: 'pointer' }}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rejection Reasons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lý do từ chối phổ biến
          <span className="text-sm font-normal text-gray-500 ml-2">(Nhấp vào cột để xem hợp đồng)</span>
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={stats.rejectionReasons}
            onClick={(data) => onChartClick(data, 'rejection')}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="reason" />
            <YAxis />
            <Tooltip />
            <Bar 
              dataKey="count" 
              fill="#EF4444"
              style={{ cursor: 'pointer' }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};