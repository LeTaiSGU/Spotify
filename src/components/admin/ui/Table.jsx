import React from "react";
import { Table } from "antd";

const AdminTable = ({
  columns,
  dataSource,
  rowKey,
  handleChange,
  pageNo,
  pageSize,
  totalElements,
}) => {
  return (
    <Table
      columns={columns}
      dataSource={dataSource} // Nhận dataSource từ props bên ngoài
      rowKey={rowKey} // Nhận rowKey từ props bên ngoài
      pagination={{
        current: pageNo + 1,
        pageSize: pageSize,
        total: totalElements,
        showSizeChanger: true,
      }}
      onChange={handleChange} // Hàm xử lý khi thay đổi trang
    />
  );
};

export default AdminTable;
