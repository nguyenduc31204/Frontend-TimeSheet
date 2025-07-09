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
//------------categories---------------
import CategoryList from "../pages/Categories/CategoryList";
import DepartmentList from '../pages/Departments/DepartmentList';

import Projects from '../pages/Projects/Projects';
import AddProject from '../pages/Projects/AddProject';
import EditProject from '../pages/Projects/EditProject';
import RoleEditPage from '../pages/Role/RoleEditPage';
import RoleListPage from '../pages/Role/RoleListPage';
import RoleAddPage from '../pages/Role/RoleAddPage';
import UserEditPage from '../pages/User/UserEditPage';
import UserAddPage from '../pages/User/UserAddPage';
import UserListPage from '../pages/User/UserListPage';
import ActivityLogPage from '../pages/ActivityLogPage';
import SettingsPage from '../pages/account/SettingsPage';
import ApprovalPage from '../pages/manager/ApprovalPage';



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
        {/* <Route element={<ProtectedRoute requiredAction="View" requiredEntity="user" />}>
            <Route path="/admin/users" element={<DashboardPage />} />
        </Route> */}
        <Route element={<ProtectedRoute requiredAction="" requiredEntity="" />}>
        <Route path="/admin/roles" element={<RoleListPage />} />
        </Route>
        <Route element={<ProtectedRoute requiredAction="" requiredEntity="" />}>
            <Route path="/admin/roles/new" element={<RoleAddPage />} />
            <Route path="/admin/roles/edit/:roleId" element={<RoleEditPage />} />
        </Route>
        

        


        <Route element={<ProtectedRoute requiredAction="View" requiredEntity="user" />}>
            <Route path="/admin/users" element={<UserListPage />} />
        </Route>
        <Route element={<ProtectedRoute requiredAction="Manage" requiredEntity="user" />}>
            <Route path="/admin/users/new" element={<UserAddPage />} />
            <Route path="/admin/users/edit/:userId" element={<UserEditPage />} />
        </Route>
        <Route path="/account/settings" element={<SettingsPage />} />

        <Route element={<ProtectedRoute requiredAction="Review" requiredEntity="timesheet" />}>
            <Route path="/manager/approvals" element={<ApprovalPage />} />
        </Route>

        <Route path="/categories" element={<CategoryList />} />
        {/* <Route path="/categories/add" element={<CategoryAdd />} />
        <Route path="/categories/edit/:id" element={<CategoryEdit />} />
        <Route path="/categories/:id" element={<CategoryDetail />} /> */}
        <Route path="/departments" element={<DepartmentList />} />
        <Route element={<ProtectedRoute requiredAction="View" requiredEntity="log" />}>
            <Route path="/admin/logs" element={<ActivityLogPage />} />
        </Route>
          
        <Route path="/Projects" element={<Projects />} />
        <Route path="/Projects/AddProject" element={<AddProject />} />
        <Route path="/Projects/EditProject/:id" element={<EditProject />} />

        

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