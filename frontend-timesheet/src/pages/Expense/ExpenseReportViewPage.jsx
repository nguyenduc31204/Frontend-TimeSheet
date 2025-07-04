// src/pages/ExpenseReportViewPage.jsx
// Tương tự như TimesheetViewPage, bạn có thể tự xây dựng trang này
// để hiển thị thông tin báo cáo chi phí ở dạng chỉ đọc.
// Đây là một ví dụ đơn giản:
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExpenseReportById } from '../../api/timesheetService';

const ExpenseReportViewPage = () => {
    const { reportId } = useParams();
    const [report, setReport] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            const data = await getExpenseReportById(reportId);
            setReport(data);
        };
        fetchReport();
    }, [reportId]);

    if (!report) return <div>Loading...</div>;

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-2">Expense Report: {report.description}</h1>
            <p className="text-gray-600 mb-4">Status: {report.status}</p>
            <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Items</h3>
                <ul>
                    {report.items.map((item, index) => (
                        <li key={index} className="flex justify-between py-2 border-b">
                            <span>{item.description} ({item.date})</span>
                            <span className="font-semibold">{formatCurrency(item.amount)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-end font-bold text-xl mt-4">
                    <span>Total: {formatCurrency(report.totalAmount)}</span>
                </div>
            </div>
            <div className="mt-8 text-right">
                <Link to="/expenses" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Back to List</Link>
            </div>
        </div>
    );
}
export default ExpenseReportViewPage;