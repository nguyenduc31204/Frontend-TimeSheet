// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiFileText, FiCheckSquare, FiPlusSquare, FiEye, FiBarChart2, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getMyTimesheets, getPendingApprovals } from '../api/timesheetService';

// --- Sub-components (no changes needed) ---
const DashboardHeader = ({ user }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.user_name}!</h1>
    <p className="mt-2 text-lg text-gray-600">Here's a quick overview of your workspace.</p>
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


// --- Main Dashboard Page Component (Rewritten) ---
const DashboardPage = () => {
  const { user, hasPermission, permissions } = useAuth();
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      console.log("Permissions của người dùng hiện tại:", permissions);
      // Fetch data concurrently for efficiency
      const [myTimesheets, pendingApprovals] = await Promise.all([
          getMyTimesheets(user.id),
          hasPermission('Review', 'timesheet') ? getPendingApprovals() : Promise.resolve([])
      ]);

      // --- Calculate Statistics ---
      const totalHoursThisWeek = myTimesheets
          // You can add date-fns library for more robust date checking
          // For now, a simple calculation
          .reduce((acc, ts) => acc + ts.totalHours, 0);

      const myPendingSubmissions = myTimesheets.filter(ts => ts.status === 'Submitted').length;
      
      const dashboardStats = [];

      dashboardStats.push({ 
          value: totalHoursThisWeek.toFixed(1), 
          label: 'Total Hours Logged', 
          icon: <FiClock className="text-blue-500"/>, 
          color: 'border-blue-500' 
      });

      // Show different stats based on user role/permission
      if (hasPermission('Review', 'timesheet')) {
          dashboardStats.push({ 
              value: pendingApprovals.length, 
              label: 'Approvals Needed', 
              icon: <FiCheckSquare className="text-green-500"/>, 
              color: 'border-green-500' 
          });
      } else {
          dashboardStats.push({ 
              value: myPendingSubmissions, 
              label: 'My Pending Submissions', 
              icon: <FiFileText className="text-yellow-500"/>, 
              color: 'border-yellow-500' 
          });
      }

      setStats(dashboardStats);
      setIsLoading(false);
    };

    fetchDashboardData();
  }, [user, hasPermission]); // Rerun when user context is available

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-12">
      <DashboardHeader user={user} />
      
      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Quick Access Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionCard 
            icon={<FiPlusSquare />}
            title="Submit Timesheet"
            description="Log your hours for the week."
            to="/timesheets/new"
          />
          <ActionCard 
            icon={<FiEye />}
            title="View My Timesheets"
            description="Review your submission history."
            to="/timesheets"
          />
           <ActionCard 
            icon={<FiPlusSquare />}
            title="Submit Expense Report"
            description="File a new report for your expenses."
            to="/expenses/new"
          />
           <ActionCard 
            icon={<FiEye />}
            title="View My Expense Reports"
            description="Check the status of your reports."
            to="/expenses"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;