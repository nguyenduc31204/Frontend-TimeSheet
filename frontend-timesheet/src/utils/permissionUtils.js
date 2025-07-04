
/**
 * Kiểm tra xem người dùng có quyền thực hiện một hành động cụ thể trên một đối tượng cụ thể hay không.
 * @param {Array<Object>} permissions - Mảng các đối tượng permission của người dùng.
 * @param {string} requiredAction - Hành động yêu cầu (ví dụ: 'View', 'Manage').
 * @param {string} requiredEntity - Đối tượng yêu cầu (ví dụ: 'user', 'product').
 * @returns {boolean} - Trả về true nếu có quyền, ngược lại trả về false.
 */
export const checkPermission = (permissions, requiredAction, requiredEntity) => {
  // Nếu không có mảng permissions hoặc mảng rỗng, chắc chắn không có quyền.
  if (!permissions || permissions.length === 0) {
    return false;
  }

  // Sử dụng Array.some() để tăng hiệu suất. 
  // Nó sẽ dừng lại ngay khi tìm thấy một kết quả khớp.
  return permissions.some(p => {
    // Điều kiện 1: Đối tượng (entity) phải khớp.
    if (p.permission_type_name === requiredEntity) {
      // Điều kiện 2: Hoặc là có quyền "Full control" trên đối tượng đó,
      // hoặc là có quyền thực hiện hành động cụ thể được yêu cầu.
      return p.permission_name === 'Full control' || p.permission_name === requiredAction;
    }
    return false;
  });
};