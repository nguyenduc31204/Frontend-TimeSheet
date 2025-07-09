import React, { createContext, useState, useContext, useEffect } from 'react';
import { checkPermission } from '../utils/permissionUtils'; // Import hàm kiểm tra quyền chi tiết
import { getPermissionsByRole, getUserProfile } from '../api/timesheetService';

// const PERMISSIONS_DATA = {
//     ADMIN: [
//       { permission_name: "Full control", permission_type_name: "user" },
//       { permission_name: "Full control", permission_type_name: "role" },
//       { permission_name: "Full control", permission_type_name: "project" },
//       { permission_name: "Full control", permission_type_name: "department" },
//       { permission_name: "Full control", permission_type_name: "category" },
//       { permission_name: "Full control", permission_type_name: "timesheet" },
//       { permission_name: "Full control", permission_type_name: "expense_report" },
//       { permission_name: "View", permission_type_name: "log" },
//     ],
//     MANAGER: [
//       { permission_name: "View", permission_type_name: "user" },
//       { permission_name: "View", permission_type_name: "project" },
//       { permission_name: "Manage", permission_type_name: "project" },
//       { permission_name: "View", permission_type_name: "timesheet" },
//       { permission_name: "Review", permission_type_name: "timesheet" },
//       { permission_name: "View", permission_type_name: "expense_report" },
//       { permission_name: "Review", permission_type_name: "expense_report" },
//     ],
//     EMPLOYEE: [
//       { permission_name: "View", permission_type_name: "timesheet" },
//       { permission_name: "Submit", permission_type_name: "timesheet" },
//       { permission_name: "View", permission_type_name: "expense_report" },
//       { permission_name: "Submit", permission_type_name: "expense_report" },
//     ]
// };

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  // State để lưu trữ thông tin người dùng và quyền hạn
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isAuthLoading, setAuthLoading] = useState(true);
  const [token, setToken] = useState(sessionStorage.getItem('Token'));



  useEffect(() => {
    const fetchAuthData = async () => {
      if (token) {
        const userProfile = await getUserProfile(token);
        console.log('userProfile', userProfile)
        
        if (userProfile) {
          setUser(userProfile);
          const userPermissions = await getPermissionsByRole(userProfile.role_id, token);
          console.log('userPermissions', userPermissions)
          setPermissions(userPermissions);
        } else {
          logout();
        }
      }
      setAuthLoading(false);
    };

    setAuthLoading(true);
    fetchAuthData();
  }, [token]);

  // Tự động khôi phục phiên đăng nhập từ sessionStorage khi tải lại trang
  // useEffect(() => {
  //   try {
  //     // 1. Lấy dữ liệu user đã lưu từ sessionStorage
  //     const storedUser = sessionStorage.getItem('authUser');
      
  //     // 2. Nếu có, phân tích và cập nhật lại state
  //     if (storedUser) {
  //       const parsedUser = JSON.parse(storedUser);
  //       setUser(parsedUser);
  //       setToken(authToken);
  //       setPermissions(PERMISSIONS_DATA[parsedUser.role] || []);
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khôi phục session:", error);
  //     // Nếu có lỗi, xóa session cũ để tránh sự cố
  //     sessionStorage.removeItem('authUser');
  //   } finally {
  //     // 3. Luôn luôn tắt trạng thái loading sau khi kiểm tra xong
  //     setAuthLoading(false);
  //   }
  // }, []);

  const login = (authToken) => {
    setToken(authToken);
    sessionStorage.setItem('Token', authToken);
  };

  // Hàm đăng xuất
  const logout = () => {
    console.log('Logging out and clearing session...');
    setUser(null);
    setPermissions([]);
    sessionStorage.removeItem('authUser');
    // KHÔNG navigate ở đây nữa
  };

  const hasPermission = (requiredAction, requiredEntity) => {
    return checkPermission(permissions, requiredAction, requiredEntity);
  };
  
  // Cung cấp state và các hàm cho toàn bộ ứng dụng
  const value = { 
    user, 
    permissions, 
    isAuthLoading, 
    isAuthenticated: !!user, 
    login, 
    logout, 
    hasPermission 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Tạo Custom Hook để sử dụng
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};