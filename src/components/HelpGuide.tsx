import React, { useState } from 'react';
import { HelpCircle, User, Shield, FileText, CheckCircle, Edit, Eye, Upload, Users, BarChart3, Settings, ChevronDown, ChevronRight } from 'lucide-react';

export const HelpGuide: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('roles');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const roles = [
    {
      id: 'admin',
      name: 'Quản trị viên (Admin)',
      icon: <Shield className="w-6 h-6 text-red-500" />,
      color: 'red',
      description: 'Có toàn quyền trong hệ thống',
      permissions: [
        'Quản lý tất cả người dùng (thêm, sửa, xóa)',
        'Xem tất cả thống kê và báo cáo',
        'Chỉnh sửa mọi hợp đồng ở bất kỳ trạng thái nào',
        'Phê duyệt và từ chối hợp đồng',
        'Ký hợp đồng điện tử',
        'Tải lên hợp đồng mới',
        'Tạo hợp đồng thủ công',
        'Phê duyệt tài khoản người dùng mới',
        'Quản lý cấu hình hệ thống'
      ],
      workflow: [
        'Đăng nhập với quyền Admin',
        'Có thể truy cập tất cả các menu',
        'Quản lý người dùng trong mục "Quản lý người dùng"',
        'Phê duyệt tài khoản mới đăng ký',
        'Xem báo cáo chi tiết trong "Thống kê"',
        'Can thiệp vào bất kỳ hợp đồng nào khi cần'
      ]
    },
    {
      id: 'manager',
      name: 'Quản lý (Manager)',
      icon: <User className="w-6 h-6 text-green-500" />,
      color: 'green',
      description: 'Quản lý và phê duyệt hợp đồng',
      permissions: [
        'Phê duyệt và từ chối hợp đồng',
        'Ký hợp đồng điện tử',
        'Tải lên hợp đồng mới',
        'Tạo hợp đồng thủ công',
        'Xem thống kê và báo cáo',
        'Chỉnh sửa hợp đồng nháp và bị từ chối',
        'Phê duyệt hợp đồng theo cấp bậc (≤ 100M VND)'
      ],
      workflow: [
        'Nhận thông báo khi có hợp đồng cần duyệt',
        'Xem chi tiết hợp đồng và đưa ra quyết định',
        'Thêm nhận xét khi phê duyệt/từ chối',
        'Chuyển hợp đồng cao giá lên cấp trên',
        'Thiết lập chữ ký điện tử cho hợp đồng đã duyệt',
        'Theo dõi tiến độ qua Dashboard'
      ]
    },
    {
      id: 'legal',
      name: 'Pháp chế (Legal)',
      icon: <FileText className="w-6 h-6 text-purple-500" />,
      color: 'purple',
      description: 'Chuyên gia pháp lý kiểm tra hợp đồng',
      permissions: [
        'Phê duyệt hợp đồng từ góc độ pháp lý',
        'Ký hợp đồng điện tử',
        'Tải lên hợp đồng mới',
        'Tạo hợp đồng thủ công',
        'Xem thống kê liên quan',
        'Chỉnh sửa hợp đồng nháp và bị từ chối',
        'Tham gia luồng phê duyệt đa cấp'
      ],
      workflow: [
        'Kiểm tra tính hợp pháp của hợp đồng',
        'Đưa ra ý kiến pháp lý chi tiết',
        'Yêu cầu chỉnh sửa nếu cần thiết',
        'Phối hợp với phòng Tài chính trong luồng duyệt',
        'Phê duyệt sau khi đảm bảo tuân thủ pháp luật',
        'Tham gia vào luồng ký điện tử'
      ]
    },
    {
      id: 'finance',
      name: 'Tài chính (Finance)',
      icon: <User className="w-6 h-6 text-indigo-500" />,
      color: 'indigo',
      description: 'Kiểm tra tài chính và ngân sách hợp đồng',
      permissions: [
        'Phê duyệt hợp đồng từ góc độ tài chính',
        'Ký hợp đồng điện tử',
        'Tải lên hợp đồng mới',
        'Tạo hợp đồng thủ công',
        'Xem thống kê tài chính',
        'Chỉnh sửa hợp đồng nháp và bị từ chối',
        'Đánh giá giá trị và ngân sách hợp đồng'
      ],
      workflow: [
        'Kiểm tra tính khả thi về mặt tài chính',
        'Đánh giá giá trị hợp đồng và ngân sách',
        'Xác minh khả năng thanh toán',
        'Phê duyệt sau khi Pháp chế đã duyệt',
        'Chuyển lên CEO nếu vượt ngưỡng',
        'Tham gia vào luồng ký điện tử'
      ]
    },
    {
      id: 'employee',
      name: 'Nhân viên (Employee)',
      icon: <User className="w-6 h-6 text-blue-500" />,
      color: 'blue',
      description: 'Người dùng cơ bản tải lên hợp đồng',
      permissions: [
        'Tải lên hợp đồng mới',
        'Tạo hợp đồng thủ công (nếu được cấp quyền)',
        'Chỉnh sửa hợp đồng nháp',
        'Chỉnh sửa hợp đồng bị từ chối',
        'Xem hợp đồng của mình',
        'Gửi hợp đồng để phê duyệt'
      ],
      workflow: [
        'Tải lên file hợp đồng hoặc tạo thủ công',
        'Hệ thống tự động xử lý OCR',
        'Kiểm tra và chỉnh sửa thông tin trích xuất',
        'Gửi hợp đồng để phê duyệt',
        'Theo dõi trạng thái và chỉnh sửa nếu bị từ chối'
      ]
    }
  ];

  const features = [
    {
      id: 'upload',
      name: 'Tải lên hợp đồng',
      icon: <Upload className="w-6 h-6 text-blue-500" />,
      description: 'Quy trình tải lên và xử lý hợp đồng',
      steps: [
        'Chọn file PDF hoặc hình ảnh hợp đồng',
        'Hệ thống tự động xử lý OCR để trích xuất thông tin',
        'Kiểm tra và chỉnh sửa thông tin đã trích xuất',
        'Thêm tags và mô tả cho hợp đồng',
        'Lưu dưới dạng nháp hoặc gửi để phê duyệt'
      ]
    },
    {
      id: 'manual-creation',
      name: 'Tạo hợp đồng thủ công',
      icon: <FileText className="w-6 h-6 text-green-500" />,
      description: 'Tạo hợp đồng trực tiếp trong hệ thống',
      steps: [
        'Nhấp nút "Tạo thủ công" trên trang chính',
        'Điền đầy đủ thông tin theo 9 mục chính',
        'Thêm các bên tham gia và phụ lục',
        'Thiết lập tags và mức độ ưu tiên',
        'Lưu dưới dạng nháp hoặc gửi để phê duyệt'
      ]
    },
    {
      id: 'approval',
      name: 'Luồng phê duyệt',
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      description: 'Quy trình phê duyệt phân cấp nhiều bước',
      steps: [
        'Hợp đồng được gửi để phê duyệt',
        'Bước 1: Quản lý phòng ban duyệt (≤100M VND)',
        'Bước 2: Pháp chế kiểm tra tính hợp pháp',
        'Bước 3: Tài chính đánh giá khả thi tài chính',
        'Bước 4: CEO duyệt cuối (>500M VND)',
        'Hoàn thành luồng phê duyệt'
      ]
    },
    {
      id: 'esignature',
      name: 'Chữ ký điện tử',
      icon: <Edit className="w-6 h-6 text-purple-500" />,
      description: 'Quy trình ký hợp đồng điện tử',
      steps: [
        'Chọn nhà cung cấp chữ ký (DocuSign, Adobe, ViettelSign)',
        'Thêm danh sách người ký và thiết lập thứ tự',
        'Gửi email mời ký cho các bên',
        'Theo dõi trạng thái ký của từng người',
        'Hoàn thành khi tất cả đã ký'
      ]
    },
    {
      id: 'versioning',
      name: 'Quản lý phiên bản',
      icon: <FileText className="w-6 h-6 text-indigo-500" />,
      description: 'Theo dõi lịch sử thay đổi hợp đồng',
      steps: [
        'Mỗi lần chỉnh sửa tạo phiên bản mới',
        'Lưu trữ đầy đủ lịch sử thay đổi',
        'So sánh sự khác biệt giữa các phiên bản',
        'Khôi phục về phiên bản trước nếu cần',
        'Theo dõi ai đã thay đổi gì và khi nào'
      ]
    }
  ];

  const workflows = [
    {
      id: 'new-contract',
      name: 'Quy trình hợp đồng mới',
      steps: [
        { step: 1, title: 'Tải lên', description: 'Nhân viên tải lên file hợp đồng', actor: 'Employee' },
        { step: 2, title: 'Xử lý OCR', description: 'Hệ thống trích xuất thông tin tự động', actor: 'System' },
        { step: 3, title: 'Kiểm tra', description: 'Nhân viên kiểm tra và chỉnh sửa thông tin', actor: 'Employee' },
        { step: 4, title: 'Gửi duyệt', description: 'Gửi hợp đồng vào luồng phê duyệt', actor: 'Employee' },
        { step: 5, title: 'Duyệt cấp 1', description: 'Quản lý phòng ban phê duyệt', actor: 'Manager' },
        { step: 6, title: 'Duyệt pháp lý', description: 'Pháp chế kiểm tra và phê duyệt', actor: 'Legal' },
        { step: 7, title: 'Duyệt tài chính', description: 'Tài chính đánh giá và phê duyệt', actor: 'Finance' },
        { step: 8, title: 'Duyệt cuối', description: 'CEO phê duyệt cuối (nếu cần)', actor: 'CEO' },
        { step: 9, title: 'Ký điện tử', description: 'Thiết lập và thực hiện ký điện tử', actor: 'All parties' },
        { step: 10, title: 'Lưu trữ', description: 'Lưu trữ hợp đồng đã hoàn thành', actor: 'System' }
      ]
    },
    {
      id: 'manual-contract',
      name: 'Quy trình tạo hợp đồng thủ công',
      steps: [
        { step: 1, title: 'Khởi tạo', description: 'Nhấp "Tạo thủ công" và mở form', actor: 'User' },
        { step: 2, title: 'Thông tin chung', description: 'Điền tên, số hợp đồng, ngày ký, hiệu lực', actor: 'User' },
        { step: 3, title: 'Các bên', description: 'Thêm thông tin các bên tham gia', actor: 'User' },
        { step: 4, title: 'Mục đích', description: 'Mô tả loại hợp đồng và mục đích', actor: 'User' },
        { step: 5, title: 'Tài chính', description: 'Nhập giá trị, phương thức thanh toán', actor: 'User' },
        { step: 6, title: 'Thời gian', description: 'Thiết lập thời hạn và tiến độ', actor: 'User' },
        { step: 7, title: 'Điều khoản', description: 'Bảo hành, phạt vi phạm, tranh chấp', actor: 'User' },
        { step: 8, title: 'Phụ lục', description: 'Danh sách tài liệu đính kèm', actor: 'User' },
        { step: 9, title: 'Tóm tắt', description: 'Mô tả tổng quan và ghi chú', actor: 'User' },
        { step: 10, title: 'Lưu', description: 'Lưu nháp hoặc gửi phê duyệt', actor: 'User' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Hướng dẫn sử dụng ContractFlow</h1>
        </div>
        <p className="text-gray-600 text-lg">Tìm hiểu cách sử dụng hệ thống quản lý và phê duyệt hợp đồng</p>
      </div>

      {/* Vai trò và quyền hạn */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => toggleSection('roles')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Vai trò và quyền hạn</h2>
          </div>
          {expandedSection === 'roles' ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        
        {expandedSection === 'roles' && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {roles.map(role => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {role.icon}
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Quyền hạn:</h4>
                    <ul className="space-y-1">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quy trình làm việc:</h4>
                    <ol className="space-y-1">
                      {role.workflow.map((step, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                          <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tính năng chính */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => toggleSection('features')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tính năng chính</h2>
          </div>
          {expandedSection === 'features' ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        
        {expandedSection === 'features' && (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {features.map(feature => (
                <div key={feature.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    {feature.icon}
                    <div>
                      <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Các bước thực hiện:</h4>
                    <ol className="space-y-2">
                      {feature.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm text-gray-600">
                          <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quy trình làm việc */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => toggleSection('workflows')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Quy trình làm việc</h2>
          </div>
          {expandedSection === 'workflows' ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        
        {expandedSection === 'workflows' && (
          <div className="px-6 pb-6">
            {workflows.map(workflow => (
              <div key={workflow.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-6">{workflow.name}</h3>
                <div className="space-y-4">
                  {workflow.steps.map((step, index) => (
                    <div key={step.step} className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {step.step}
                        </div>
                        {index < workflow.steps.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{step.title}</h4>
                          <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {step.actor}
                          </span>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => toggleSection('faq')}
          className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Câu hỏi thường gặp</h2>
          </div>
          {expandedSection === 'faq' ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        
        {expandedSection === 'faq' && (
          <div className="px-6 pb-6 space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Tôi có thể chỉnh sửa hợp đồng khi nào?</h4>
              <p className="text-gray-600">Bạn có thể chỉnh sửa hợp đồng khi ở trạng thái "Nháp" hoặc "Bị từ chối". Admin có thể chỉnh sửa hợp đồng ở mọi trạng thái.</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Làm sao để tạo hợp đồng thủ công?</h4>
              <p className="text-gray-600">Nhấp nút "Tạo thủ công" trên trang chính, điền đầy đủ 9 mục thông tin theo template chuẩn, sau đó lưu nháp hoặc gửi phê duyệt.</p>
            </div>
            
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Luồng phê duyệt hoạt động như thế nào?</h4>
              <p className="text-gray-600">Hợp đồng sẽ đi qua các bước: Quản lý phòng ban → Pháp chế → Tài chính → CEO (nếu >500M VND). Mỗi bước có thể phê duyệt hoặc từ chối.</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Làm sao để thiết lập chữ ký điện tử?</h4>
              <p className="text-gray-600">Sau khi hợp đồng được phê duyệt, vào chi tiết hợp đồng, chọn tab "Chữ ký điện tử", thêm người ký và thiết lập thứ tự ký.</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Tôi có thể xem lịch sử thay đổi hợp đồng không?</h4>
              <p className="text-gray-600">Có, trong chi tiết hợp đồng, nhấp vào "Lịch sử phiên bản" để xem tất cả các thay đổi và so sánh giữa các phiên bản.</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Làm sao để nhận thông báo khi hợp đồng sắp hết hạn?</h4>
              <p className="text-gray-600">Trong chi tiết hợp đồng, vào tab "Nhắc nhở" để thiết lập các thông báo tự động cho hết hạn, gia hạn hoặc xem xét.</p>
            </div>
            
            <div className="border-l-4 border-amber-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-2">Thống kê có những loại báo cáo nào?</h4>
              <p className="text-gray-600">Hệ thống cung cấp thống kê tổng quan, phân tích theo thời gian (ngày/tháng/năm), lý do từ chối, thời gian xử lý và xu hướng phê duyệt.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};