// src/mockData.js
export const submissions = [
  {
    id: 1,
    employee: { id: 101, name: "Nguyễn Văn An" },
    department: { id: 1, name: "Công nghệ" },
    project: { id: 201, name: "Hệ thống CRM" },
    submissionDate: "2025-07-03T09:00:00Z",
    type: "Timesheet",
    total: 40, // hours
    status: "Pending",
    details: { // tb_entry
      entries: [
        { day: "Thứ Hai", project: "Hệ thống CRM", task: "Phát triển module", hours: 8 },
        { day: "Thứ Ba", project: "Hệ thống CRM", task: "Fix bug", hours: 8 },
        { day: "Thứ Tư", project: "Hệ thống CRM", task: "Họp team", hours: 8 },
        { day: "Thứ Năm", project: "Bảo trì", task: "Kiểm tra hệ thống", hours: 8 },
        { day: "Thứ Sáu", project: "Hệ thống CRM", task: "Deploy", hours: 8 },
      ],
    },
  },
  {
    id: 2,
    employee: { id: 102, name: "Trần Thị Bích" },
    department: { id: 1, name: "Công nghệ" },
    project: { id: 202, name: "Ứng dụng Di động" },
    submissionDate: "2025-07-02T14:30:00Z",
    type: "Expense Report",
    total: 2500000, // amount in VND
    status: "Pending",
    details: { // tb_expense_item
      items: [
        { date: "2025-07-01", category: "Di chuyển", description: "Taxi đi gặp khách hàng", amount: 350000 },
        { date: "2025-07-01", category: "Ăn uống", description: "Tiếp khách hàng A", amount: 1500000 },
        { date: "2025-07-02", category: "Vật tư", description: "Mua cáp sạc", amount: 650000 },
      ],
    },
  },
  {
    id: 3,
    employee: { id: 103, name: "Lê Văn Cường" },
    department: { id: 2, name: "Kinh doanh" },
    project: { id: 301, name: "Chiến dịch Q3" },
    submissionDate: "2025-07-01T11:00:00Z",
    type: "Timesheet",
    total: 32,
    status: "Approved",
    details: { entries: [/*...*/] }
  },
  {
    id: 4,
    employee: { id: 101, name: "Nguyễn Văn An" },
    department: { id: 1, name: "Công nghệ" },
    project: { id: 202, name: "Ứng dụng Di động" },
    submissionDate: "2025-06-30T17:00:00Z",
    type: "Timesheet",
    total: 40,
    status: "Rejected",
    details: { entries: [/*...*/] }
  },
];