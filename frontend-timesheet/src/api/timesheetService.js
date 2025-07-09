// src/api/apiService.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const API_BASE_URL = 'http://localhost:3001';

export const getTimesheets = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/timesheets`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch timesheets:", error);
    return []; // Return empty array on error
  }
};

export const getExpenseReports = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/expense_reports`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch expense reports:", error);
      return []; // Return empty array on error
    }
  };

  export const getTimesheetById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/timesheets/${id}`);
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch timesheet with id ${id}:`, error);
        return null;
    }
};  

  export const updateTimesheet = async (id, timesheetData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timesheets/${id}`, {
        method: 'PUT', // Hoặc 'PATCH' nếu bạn chỉ cập nhật một phần
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timesheetData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to update timesheet with id ${id}:`, error);
      return null;
    }
  };
// Bạn có thể thêm các hàm khác ở đây: getTimesheetById, createTimesheet, ...


export const getExpenseReportById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expense_reports/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch expense report with id ${id}:`, error);
    return null;
  }
};

export const getExpenseReportByUser = async (token, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expense_report/get-expense-reports-by-user?user_id=${id}`,{
        headers : {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'Authorization': `Bearer ${token}` ,
            
        }
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    console.log(result.data)

    return result.data; 
  } catch (error) {
    console.error(`Failed to fetch expense report with id ${id}:`, error);
    return null;
  }
};

export const createExpenseReport = async (reportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expense_reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Failed to create expense report:', error);
      return null;
    }
};

export const updateExpenseReport = async (id, reportData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expense_reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`Failed to update expense report with id ${id}:`, error);
      return null;
    }
};

export const getCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
};




export const getRoles = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles`);
        if (!response.ok) throw new Error('Failed to fetch roles');
        return await response.json();
    } catch (error) {
        console.error("Error fetching roles:", error);
        return [];
    }
};

export const getRoleById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch role');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching role ${id}:`, error);
        return null;
    }
};

export const getAllPermissions = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/permissions`);
        if (!response.ok) throw new Error('Failed to fetch permissions');
        return await response.json();
    } catch (error) {
        console.error("Error fetching permissions:", error);
        return [];
    }
};

export const updateRole = async (id, roleData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roleData),
        });
        if (!response.ok) throw new Error('Failed to update role');
        return await response.json();
    } catch (error) {
        console.error(`Error updating role ${id}:`, error);
        return null;
    }
};


export const createRole = async (roleData) => {
    try {
        // json-server sẽ tự tạo id, nên chúng ta không cần gửi id
        const response = await fetch(`${API_BASE_URL}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(roleData),
        });
        if (!response.ok) throw new Error('Failed to create role');
        return await response.json();
    } catch (error) {
        console.error('Error creating role:', error);
        return null;
    }
};


export const getUsers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const getUserById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        return await response.json();
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
};

export const getDepartments = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/department`);
        if (!response.ok) throw new Error('Failed to fetch departments');
        return await response.json();
    } catch (error) {
        console.error("Error fetching departments:", error);
        return [];
    }
};

export const createUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to create user');
        return await response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        return null;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return await response.json();
    } catch (error) {
        console.error(`Error updating user ${id}:`, error);
        return null;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return true; // Return true on success
    } catch (error) {
        console.error(`Error deleting user ${id}:`, error);
        return false;
    }
};

export const getActivityLogs = async () => {
    try {
        // Sắp xếp để log mới nhất lên đầu
        const response = await fetch(`${API_BASE_URL}/activity_logs?_sort=timestamp&_order=desc`);
        if (!response.ok) throw new Error('Failed to fetch activity logs');
        return await response.json();
    } catch (error) {
        console.error("Error fetching activity logs:", error);
        return [];
    }
};

export const getMyTimesheets = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/timesheets?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user timesheets');
        return await response.json();
    } catch (error) {
        console.error("Error fetching user timesheets:", error);
        return [];
    }
};

// Lấy tất cả các yêu cầu đang chờ phê duyệt (dành cho manager/admin)
export const getPendingApprovals = async () => {
    try {
        const timesheets = await fetch(`${API_BASE_URL}/timesheets?status=Submitted`);
        const expenses = await fetch(`${API_BASE_URL}/expense_reports?status=Submitted`);

        if (!timesheets.ok || !expenses.ok) throw new Error('Failed to fetch pending approvals');
        
        const pendingTimesheets = await timesheets.json();
        console.log('pendingTimesheets', pendingTimesheets)
        const pendingExpenses = await expenses.json();
        
        return [...pendingTimesheets, ...pendingExpenses];
    } catch (error) {
        console.error("Error fetching pending approvals:", error);
        return [];
    }
};


export const loginUser = async (user_email, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'ngrok-skip-browser-warning': 'true',
            },
            body: JSON.stringify({ user_email, password }),
        });
        if (!response.ok) {
           throw new Error('Invalid credentials');
        }
        const result = await response.json();
        console.log(result.data)

        return result; 
    } catch (error) {
        console.error('Login failed:', error);
        return null;
    }
};

export const getUserProfile = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/users/my-info`, {
            headers: { 'Authorization': `Bearer ${token}` ,
                'ngrok-skip-browser-warning': 'true',
        }
        });
        if (!response.ok) throw new Error('Invalid or expired token');
        const result = await response.json();
        console.log('1231413',result)
        return result.data.user; 
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        return null;
    }
};

export const getPermissionsByRole = async (role_id, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/permissions/get-permissions-by-role?role_id=${role_id}`, {
            headers: { 'Authorization': `Bearer ${token}` ,
                'ngrok-skip-browser-warning': 'true',
        }
        });
        if (!response.ok) throw new Error('Failed to fetch permissions');
        const result = await response.json();
        console.log('1231413',result)
        return result.data.user; 
    } catch (error) {
        console.error(`Failed to fetch permissions for role ${role_id}:`, error);
        return [];
    }
};

// Hàm mới để lấy tất cả quyền cho trang admin
export const getAllPermission = async (token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/permissions/get-permissions`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch all permissions');
        return await response.json();
    } catch (error) {
        console.error("Error fetching all permissions:", error);
        return [];
    }
};


const updateItemStatus = async (itemType, id, status, reason = '') => {
    try {
        const payload = { status };
        // In a real app, you'd likely save the rejection reason as well.
        // if (reason) payload.rejectionReason = reason;

        const response = await fetch(`${API_BASE_URL}/${itemType}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Failed to update ${itemType} status`);
        return await response.json();
    } catch (error) {
        console.error(`Error updating status for ${itemType} ${id}:`, error);
        return null;
    }
};

export const approveItem = (itemType, id) => {
    return updateItemStatus(itemType, id, 'Approved');
};

export const rejectItem = (itemType, id, reason) => {
    return updateItemStatus(itemType, id, 'Rejected', reason);
};


export const createNotification = async (notificationData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notificationData),
        });
        if (!response.ok) throw new Error('Failed to create notification');
        return await response.json();
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
};


// Lấy các thông báo chưa đọc của một user
export const getUnreadNotifications = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications?userId=${userId}&isRead=false&_sort=timestamp&_order=desc`);
        if (!response.ok) throw new Error('Failed to fetch notifications');
        return await response.json();
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
};

// Đánh dấu một thông báo là đã đọc
export const markNotificationAsRead = async (notificationId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isRead: true }),
        });
        if (!response.ok) throw new Error('Failed to mark notification as read');
        return await response.json();
    } catch (error) {
        console.error(`Error updating notification ${notificationId}:`, error);
        return null;
    }
};