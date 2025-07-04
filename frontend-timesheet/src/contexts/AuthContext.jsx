// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkPermission } from '../utils/permissionUtils'; // <-- IMPORT HÀM MỚI

// --- DỮ LIỆU PHÂN QUYỀN GIẢ LẬP (THEO CẤU TRÚC MỚI) ---
const PERMISSIONS_DATA = {
    ADMIN: [
      { permission_id: 66, permission_name: "Full control", permission_type_name: "product" },
      { permission_id: 70, permission_name: "Full control", permission_type_name: "user" },
      // ... và tất cả các quyền khác của Admin
    ],
    MANAGER: [
      { permission_id: 67, permission_name: "View", permission_type_name: "product" },
      { permission_id: 68, permission_name: "Manage", permission_type_name: "product" },
      { permission_id: 71, permission_name: "View", permission_type_name: "user" },
      // ... và các quyền khác của Manager
    ],
    EMPLOYEE: [
      { permission_id: 67, permission_name: "View", permission_type_name: "product" },
      // ...
    ]
};
// --------------------------------

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]); // permissions giờ là mảng các object
  const [isAuthLoading, setAuthLoading] = useState(true);
  
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('authUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Lấy danh sách quyền từ dữ liệu giả lập dựa trên role
        setPermissions(PERMISSIONS_DATA[parsedUser.role] || []);
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    const userPermissions = PERMISSIONS_DATA[userData.role] || [];
    setPermissions(userPermissions);
    
    // Lưu ý: Chỉ lưu thông tin cơ bản của user, không cần lưu cả list permission vào session
    sessionStorage.setItem('authUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setPermissions([]);
    sessionStorage.removeItem('authUser');
  };

  // Hàm hasPermission giờ sẽ gọi hàm checkPermission
  const hasPermission = (requiredAction, requiredEntity) => {
    return checkPermission(permissions, requiredAction, requiredEntity);
  };
  
  const value = { user, permissions, isAuthLoading, login, logout, hasPermission };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};