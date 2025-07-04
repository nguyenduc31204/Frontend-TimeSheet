// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các Layouts
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import TimesheetLogin from '../pages/Auth/login';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute';
import TimesheetPage from '../pages/TimeSheet/TimesheetPage';
import TimesheetAddPage from '../pages/TimeSheet/TimesheetAddPage';
import TimesheetEditPage from '../pages/TimeSheet/TimesheetEditPage';
import TimesheetViewPage from '../pages/TimeSheet/TimesheetViewPage';
import ExpenseReportListPage from '../pages/Expense/ExpenseReportListPage';
import ExpenseReportAddPage from '../pages/Expense/ExpenseReportAddPage';
import ExpenseReportEditPage from '../pages/Expense/ExpenseReportEditPage';
import ExpenseReportViewPage from '../pages/Expense/ExpenseReportViewPage';


const AppRoutes = () => {
  return (
    <Routes>
      {/* === Các Route sử dụng MainLayout (có Sidebar/Navbar) === */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/timesheets" element={<TimesheetPage />} />
        <Route path="/timesheets/new" element={<TimesheetAddPage />} />         {/* <-- ADD */}
          <Route path="/timesheets/edit/:timesheetId" element={<TimesheetEditPage />} /> {/* <-- ADD */}
          <Route path="/timesheets/view/:timesheetId" element={<TimesheetViewPage />} /> {/* <-- ADD */}

          <Route path="/expenses" element={<ExpenseReportListPage />} />
        <Route path="/expenses/new" element={<ExpenseReportAddPage />} />
        <Route path="/expenses/edit/:reportId" element={<ExpenseReportEditPage />} />
        <Route path="/expenses/view/:reportId" element={<ExpenseReportViewPage />} />
        {/* <Route path="/manager/approvals" element={<ApprovalPage />} /> */}
        <Route element={<ProtectedRoute requiredAction="View" requiredEntity="user" />}>
            <Route path="/admin/users" element={<DashboardPage />} />
        </Route>
      </Route>

      {/* === Các Route sử dụng AuthLayout (KHÔNG có Sidebar/Navbar) === */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<TimesheetLogin />} />
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
      </Route>
      
      {/* === Route cho trang không tìm thấy (404) === */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  );
};

export default AppRoutes;