// src/api/apiService.js

const API_BASE_URL = 'http://localhost:3001';

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