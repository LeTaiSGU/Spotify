import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, Space, Card, Select, message } from "antd";
import AdminTable from "../../../components/admin/ui/Table";

const { Option } = Select;

const PLS = () => {
  const [users, setUsers] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [sortedInfo, setSortedInfo] = useState({});
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users/getall/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      message.error("Không thể tải danh sách người dùng");
    }
  };

  // Fetch playlists by user
  const fetchPlaylistsByUser = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/playlists/Admin/getplaylistbyUser/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setPlaylists(res.data);
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
      message.error("Không thể tải danh sách playlist");
    }
  };

  // Fetch songs in a playlist
  const fetchSongsByPlaylist = async (playlistId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/playlist_songs/${playlistId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (Array.isArray(res.data)) {
        setSongs(res.data);
        setTotalElements(res.data.length);
      } else {
        console.error("Unexpected response format:", res.data);
        message.error("Dữ liệu trả về không hợp lệ");
      }
    } catch (err) {
      console.error("Failed to fetch songs:", err);
      message.error("Không thể tải bài hát");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedUserId !== null) {
      setSelectedPlaylistId(null); // Reset playlist khi đổi user
      setSongs([]); // Clear song list
      fetchPlaylistsByUser(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedPlaylistId !== null) {
      fetchSongsByPlaylist(selectedPlaylistId);
    }
  }, [selectedPlaylistId]);

  const handlePlaylistChange = (value) => {
    setSelectedPlaylistId(value);
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
      title: "Tên bài hát",
      dataIndex: "song_name",
      key: "song_name",
      sorter: (a, b) => a.song_name.localeCompare(b.song_name),
      sortOrder: sortedInfo.columnKey === "song_name" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Ảnh",
      dataIndex: "img",
      key: "img",
      render: (url) => (
        <img
          src={url}
          alt="Song"
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
        {/* Select User */}
        <Select
          placeholder="Chọn người dùng"
          style={{ width: 200 }}
          onChange={setSelectedUserId}
          value={selectedUserId}
        >
          {users.map((user) => (
            <Option key={user.id} value={user.id}>
              {user.name}
            </Option>
          ))}
        </Select>

        {/* Select Playlist */}
        <Select
          placeholder="Chọn Playlist"
          style={{ width: 300 }}
          onChange={handlePlaylistChange}
          value={selectedPlaylistId}
          disabled={!selectedUserId}
        >
          {playlists.map((playlist) => (
            <Option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </Option>
          ))}
        </Select>

        <Button onClick={clearAll}>Clear Sort</Button>
      </Space>

      {/* Bảng danh sách bài hát */}
      <AdminTable
        columns={columns}
        dataSource={songs}
        rowKey="id"
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default PLS;
