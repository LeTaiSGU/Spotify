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
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={{
        current: pageNo + 1, // Hiển thị trang hiện tại (pageNo + 1)
        pageSize: pageSize,
        total: totalElements,
        showSizeChanger: true,
      }}
      onChange={handleChange} // Hàm xử lý khi thay đổi trang
    />
  );
};

export default AdminTable;
