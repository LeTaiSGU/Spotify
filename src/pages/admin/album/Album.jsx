import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlbums,
  toggleAlbumStatus,
} from "../../../redux/slice/albumSlice"; // Giả sử bạn có action này
import { Table, Button, Space } from "antd";
import AdminTable from "../../../components/admin/ui/Table"; // Giả sử bạn có component này

const Album = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    dispatch(fetchAlbums({ pageNo: 0, pageSize: 10 }));
  }, [dispatch]);

  const {
    content: albums = [],
    pageNo = 0,
    pageSize = 10,
    totalElements = 0,
  } = useSelector((state) => state.album.items || {});

  const handleStatusChange = (albumId) => {
    // Cập nhật trạng thái album (Active/Inactive)
    dispatch(toggleAlbumStatus(albumId));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "albumId",
      key: "albumId",
      sorter: (a, b) => a.albumId - b.albumId,
      sortOrder: sortedInfo.columnKey === "albumId" ? sortedInfo.order : null,
    },
    {
      title: "Nghệ sĩ",
      dataIndex: "artist",
      key: "artist",
      render: (artist) => {
        return artist?.name;
      },
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      sortOrder: sortedInfo.columnKey === "title" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Ngày phát hành",
      dataIndex: "releaseDate",
      key: "releaseDate",
      sorter: (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate),
      sortOrder:
        sortedInfo.columnKey === "releaseDate" ? sortedInfo.order : null,
    },
    {
      title: "Hình ảnh",
      dataIndex: "coverImage",
      key: "coverImage",
      render: (url) => (
        <img
          src={url}
          alt="Cover"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.albumId)}
            type={status ? "default" : "primary"}
            danger={status} // nút màu đỏ nếu đang active
          >
            {status ? "Hủy" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (pagination, filter, sorter) => {
    setSortedInfo(sorter);
    dispatch(
      fetchAlbums({
        pageNo: pagination.current - 1,
        pageSize: pagination.pageSize,
      })
    );
  };

  const clearAll = () => {
    setSortedInfo({});
  };

  return (
    <div className="p-4">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Clear</Button>
      </Space>
      <AdminTable
        columns={columns}
        dataSource={albums}
        rowKey="albumId"
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Album;
