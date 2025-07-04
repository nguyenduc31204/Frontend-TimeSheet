// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiFileText, FiAlertTriangle, FiPlusSquare, FiEye, FiBarChart2, FiArrowRight } from 'react-icons/fi';

// --- Giả lập Custom Hook ---
// Trong dự án thật, hook này sẽ lấy dữ liệu từ Context API
const useAuth = () => {
  const user = {
    name: 'Nguyễn Văn An',
  };
  return { user };
};
// ----------------------------

// === CÁC COMPONENT CON CHUYÊN BIỆT CHO DASHBOARD ===
// Trong dự án lớn, bạn có thể tách các component này ra file riêng trong `src/components/features/dashboard/`

const DashboardHeader = ({ user }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
    <p className="mt-2 text-lg text-gray-600">Here's a quick overview of your work today..</p>
  </div>
);

const StatCard = ({ icon, value, label, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
    <div className="flex items-center space-x-4">
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </div>
);

const ActionCard = ({ icon, title, description, to }) => (
  <Link to={to} className="group block bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center space-x-4">
      <div className="text-3xl text-indigo-600 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <FiArrowRight className="ml-auto text-gray-400 group-hover:text-indigo-600 transition-colors" />
    </div>
  </Link>
);

const Spinner = () => (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
);


// === COMPONENT TRANG DASHBOARD CHÍNH ===
const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập việc fetch dữ liệu từ API
  useEffect(() => {
    const fetchDashboardData = () => {
      // Dữ liệu giả lập
      const mockStats = [
        { value: '32/40', label: 'Hours recorded this week', icon: <FiClock className="text-blue-500"/>, color: 'border-blue-500' },
        { value: '1', label: 'Yêu cầu chờ duyệt', icon: <FiFileText className="text-yellow-500"/>, color: 'border-yellow-500' },
        { value: 'Hôm nay', label: 'Hạn nộp tiếp theo', icon: <FiAlertTriangle className="text-red-500"/>, color: 'border-red-500' },
      ];
      
      // Giả lập độ trễ mạng
      setTimeout(() => {
        setStats(mockStats);
        setIsLoading(false);
      }, 1000); // 1 giây
    };

    fetchDashboardData();
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-12">
      <DashboardHeader user={user} />
      
      {/* Lưới Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Lưới Truy cập nhanh */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Truy cập nhanh</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionCard 
            icon={<FiPlusSquare />}
            title="Nộp Timesheet mới"
            description="Ghi lại giờ làm của bạn cho tuần này."
            to="/submit" // Thay đổi route nếu cần
          />
          <ActionCard 
            icon={<FiEye />}
            title="Xem các Timesheet đã nộp"
            description="Kiểm tra lại lịch sử chấm công của bạn."
            to="/history" // Thay đổi route nếu cần
          />
           <ActionCard 
            icon={<FiBarChart2 />}
            title="Xem báo cáo"
            description="Phân tích và xem tổng quan giờ làm."
            to="/reports" // Thay đổi route nếu cần
          />
           {/* <ActionCard 
            icon={<FiClipboard />}
            title="Đi đến trang Phê duyệt"
            description="Dành cho Manager: xem xét các yêu cầu."
            to="/manager/approvals"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;