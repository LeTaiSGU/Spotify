import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card } from "antd";
import {
  fetchSongsAdmin,
  toggleSongStatus,
} from "../../../redux/slice/songAdminSlice"; // Giả sử bạn có action này
import AdminTable from "../../../components/admin/ui/Table"; // Giả sử bạn có component này

const Songs = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    dispatch(
      fetchSongsAdmin({
        pageNo: 0,
        pageSize: 10,
      })
    );
  }, [dispatch]);
  const {
    content: songAdmin = [],
    pageNo = 0,
    pageSize = 10,
    totalElements = 0,
  } = useSelector((state) => state.songAdmin.items || {});

  const handleStatusChange = (songId) => {
    dispatch(toggleSongStatus(songId));
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "songId", // Cập nhật tên cột
      key: "songId",
      sorter: (a, b) => a.songId - b.songId,
      sortOrder: sortedInfo.columnKey === "songId" ? sortedInfo.order : null,
    },
    {
      title: "Tên bài hát",
      dataIndex: "songName", // Cập nhật tên cột
      key: "songName",
      sorter: (a, b) => a.songName - b.songName,
      sortOrder: sortedInfo.columnKey === "songName" ? sortedInfo.order : null,
    },
    {
      title: "Album",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Nghệ sĩ sở hữu",
      dataIndex: "artistName",
      key: "artistName",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => {
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      },
    },
    {
      title: "File",
      dataIndex: "fileUpload",
      key: "fileUpload",
    },
    {
      title: "Nghệ sĩ tham gia",
      dataIndex: "featuredArtists",
      key: "featuredArtists",
      render: (featuredArtists) => {
        if (Array.isArray(featuredArtists)) {
          // Chuyển mảng đối tượng thành mảng tên nghệ sĩ
          const artistNames = featuredArtists.map((artist) => artist.name);
          // Nối các tên nghệ sĩ thành chuỗi, cách nhau bởi dấu phẩy
          return artistNames.join(", ");
        }
        return "";
      },
      // ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      render: (url) => (
        <img
          src={url}
          alt="Cover"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "createdAt", // Cập nhật tên cột
      key: "createdAt",
      sorter: (a, b) => a.createdAt - b.createdAt,
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
    },
    {
      title: "Trạng thái",
      dataIndex: "status", // Cập nhật tên cột
      key: "status",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.songId)} // Gọi hàm khi nhấn nút
            type={status ? "default" : "primary"}
            danger={status} // nút màu đỏ nếu đang private
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
      fetchSongsAdmin({
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
        dataSource={songAdmin}
        rowKey="songId"
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Songs;
