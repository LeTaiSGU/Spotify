import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/Table"; // Giả sử bạn có component này

const Playlist = () => {
  const [playlistsAdmin, setPlaylistsAdmin] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupData, setPopupData] = useState({ type: "", songs: [] });

  // Fetch playlists from the API
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/playlists/getall/", {
          params: {
            page: pageNo,
            size: pageSize,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        // Kiểm tra xem response.data có phải là mảng không
        if (Array.isArray(response.data)) {
          setPlaylistsAdmin(response.data);  // Nếu là mảng, gán trực tiếp cho playlistsAdmin
          setTotalElements(response.data.length);  // Nếu là mảng, tổng số phần tử là độ dài của mảng
        } else {
          console.error("API returned unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
  
    fetchPlaylists();
  }, [pageNo, pageSize]);
  

  const handleStatusChange = (playlistId) => {
    // Dispatch your action to toggle playlist status here
    console.log(`Toggle status for playlist ID: ${playlistId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id", // Đổi từ 'playlistId' thành 'id'
      key: "id",
      sorter: (a, b) => a.id - b.id, // Sắp xếp theo 'id'
      sortOrder:
        sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    },
    {
      title: "Tên Playlist",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === "name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "User sở hữu",
      dataIndex: "username", // Truy cập trực tiếp vào 'username'
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username), // Sắp xếp theo 'username'
      sortOrder: sortedInfo.columnKey === "username" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "cover_image", // Truy cập trực tiếp vào 'cover_image'
      key: "cover_image",
      render: (url) => (
        <img
          src={url}
          alt="Cover"
          style={{ width: 40, height: 40, objectFit: "cover" }}
        />
      ),
    },
  ];

  const handleChange = (pagination, filter, sorter) => {
    setSortedInfo(sorter);
    setPageNo(pagination.current - 1);
    setPageSize(pagination.pageSize);
  };

  const clearAll = () => {
    setSortedInfo({});
  };

  return (
    <div className="p-4">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearAll}>Clear</Button>
      </Space>
      <Modal
        title={`Danh sách bài hát ${popupData.type}`}
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Card>
          <ul>
            {popupData.songs?.length > 0 ? (
              popupData.songs.map((song, index) => (
                <li key={index}>
                  Bài hát #{song.songId} - {song.songName}
                </li>
              ))
            ) : (
              <p>Không có bài hát nào</p>
            )}
          </ul>
        </Card>
      </Modal>

      <AdminTable
        columns={columns}
        dataSource={playlistsAdmin}
        rowKey="id" // Dùng 'id' làm key cho mỗi dòng
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Playlist;
