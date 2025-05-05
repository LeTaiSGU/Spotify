import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAlbums,
  toggleAlbumStatus,
  selectItemsAlbum,
  selectAlbumLoading,
} from "../../../redux/slice/albumSlice";
import { Table, Button, Space, message } from "antd";
import AdminTable from "../../../components/admin/ui/Table";

const Album = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchAlbums({ pageNo: 0, pageSize: 10 }))
      .unwrap()
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        message.error(
          "Không thể tải danh sách album: " + (err.message || "Lỗi")
        );
      });
  }, [dispatch]);

  // Điều chỉnh để xử lý cấu trúc dữ liệu từ API Django
  const albumsData = useSelector(selectItemsAlbum);
  const isLoading = useSelector(selectAlbumLoading);

  // Xử lý cả hai định dạng dữ liệu (phân trang hoặc mảng đơn giản)
  const albums = Array.isArray(albumsData)
    ? albumsData
    : albumsData?.content || [];
  const pageNo = albumsData?.pageNo || 0;
  const pageSize = albumsData?.pageSize || 10;
  const totalElements = albumsData?.totalElements || albums.length;

  const handleStatusChange = (albumId) => {
    setLoading(true);
    dispatch(toggleAlbumStatus(albumId))
      .unwrap()
      .then(() => {
        setLoading(false);
        message.success("Đã cập nhật trạng thái album");
      })
      .catch((err) => {
        setLoading(false);
        message.error(
          "Không thể cập nhật trạng thái: " + (err.message || "Lỗi")
        );
      });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    },
    {
      title: "Nghệ sĩ",
      dataIndex: "artist",
      key: "artist",
      render: (artist) => artist?.name || "N/A",
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
      dataIndex: "release_date",
      key: "release_date",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.release_date || 0) - new Date(b.release_date || 0),
      sortOrder:
        sortedInfo.columnKey === "release_date" ? sortedInfo.order : null,
    },
    {
      title: "Hình ảnh",
      dataIndex: "avatar",
      key: "avatar",
      render: (url) => (
        <img
          src={url}
          alt="Cover"
          style={{ width: 40, height: 40, objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/40";
          }}
        />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text) =>
        text?.length > 30 ? `${text.substring(0, 30)}...` : text,
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
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
        <Button onClick={clearAll}>Xóa bộ lọc</Button>
        <Button
          type="primary"
          onClick={() => dispatch(fetchAlbums({ pageNo: 0, pageSize: 10 }))}
        >
          Làm mới
        </Button>
      </Space>
      <AdminTable
        columns={columns}
        dataSource={albums}
        rowKey={(record) => record.id}
        loading={isLoading || loading}
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Album;
