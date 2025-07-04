// src/utils/exportUtils.js
import * as XLSX from 'xlsx';

/**
 * Exports an array of objects to an Excel file.
 * @param {Array<Object>} data - The data to export, an array of objects.
 * @param {string} fileName - The desired name of the output file (without extension).
 */
export const exportToExcel = (data, fileName) => {
  // 1. Create a new workbook
  const workbook = XLSX.utils.book_new();

  // 2. Convert the array of objects to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3. Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 4. Trigger the download of the file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};