import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Space, Card, Select, message } from "antd";
import AdminTable from "../../../components/admin/ui/Table";
import { API_ROOT } from "~/utils/constants";
const { Option } = Select;

const Playlist = () => {
  const [playlistsAdmin, setPlaylistsAdmin] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupData, setPopupData] = useState({ type: "", songs: [] });
  const [users, setUsers] = useState([]); // Lưu danh sách người dùng
  const [selectedUser, setSelectedUser] = useState(null); // Lưu user đã chọn

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
       const response = await axios.get(
        `${API_ROOT}/api/users/getall`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Không thể tải danh sách người dùng");
      }
    };
    fetchUsers();
  }, []);

  // Fetch playlists based on the selected user
  // Fetch playlists based on the selected user
  useEffect(() => {
    const fetchPlaylists = async (selectedUser) => {
      if (selectedUser) {
        try {
          const response = await axios.get(
            `${API_ROOT}/api/playlists/Admin/getplaylistbyUser/${selectedUser}/`,
            {
              params: {
                userId: selectedUser, // Lọc playlist theo userId
                page: pageNo,
                size: pageSize,
              },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (Array.isArray(response.data)) {
            setPlaylistsAdmin(response.data); // Nếu là mảng, gán trực tiếp cho playlistsAdmin
            setTotalElements(response.data.length); // Nếu là mảng, tổng số phần tử là độ dài của mảng
          } else {
            console.error(
              "API returned unexpected data format:",
              response.data
            );
          }
        } catch (error) {
          console.error("Error fetching playlists:", error);
          message.error("Không thể tải danh sách playlist");
        }
      }
    };

    // Call the function to fetch playlists when user is selected
    if (selectedUser) {
      fetchPlaylists(selectedUser);
    }
  }, [pageNo, pageSize, selectedUser]); // Rerun when selectedUser, pageNo, or pageSize changes

  const handleStatusChange = (playlistId) => {
    console.log(`Toggle status for playlist ID: ${playlistId}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id", // Đổi từ 'playlistId' thành 'id'
      key: "id",
      sorter: (a, b) => a.id - b.id, // Sắp xếp theo 'id'
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
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
        <Select
          placeholder="Chọn user"
          style={{ width: 200 }}
          onChange={(value) => setSelectedUser(value)}
        >
          {users.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>
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
