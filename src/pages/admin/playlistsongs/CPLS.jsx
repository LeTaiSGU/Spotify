import React, { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import axios from "axios";

const { Option } = Select;

const AddSongToPlaylist = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);  // Lưu trữ danh sách người dùng
  const [playlists, setPlaylists] = useState([]);  // Lưu trữ danh sách playlist
  const [songs, setSongs] = useState([]);  // Lưu trữ danh sách bài hát
  const [selectedUserId, setSelectedUserId] = useState(null);  // Lưu trữ người dùng đã chọn

  // Lấy danh sách người dùng
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/getall/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch(() => message.error("Không thể tải danh sách người dùng"));
  }, []);

  // Lấy danh sách bài hát
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/songs/getallsong/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setSongs(res.data))
      .catch(() => message.error("Không thể tải bài hát"));
  }, []);

  // Lấy danh sách playlist theo người dùng
  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`http://localhost:8000/api/playlists/getplaylistbyUser/${selectedUserId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setPlaylists(res.data))
        .catch(() => message.error("Không thể tải playlist của người dùng"));
    }
  }, [selectedUserId]);

  const onFinish = async (values) => {
    const playlist_id = values.playlist_id;
    const song_id = values.song_id;
  
    try {
      const response = await axios.post(
        `http://localhost:8000/api/playlist_songs/${playlist_id}/${song_id}/`,
        null, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json", // 👈 thêm dòng này
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 201) {
        message.success("Đã thêm bài hát vào playlist!");
        form.resetFields();
      } else {
        message.error("Lỗi khi thêm bài hát vào playlist");
      }
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi thêm bài hát vào playlist");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Chọn người dùng */}
        <Form.Item
          name="user_id"
          label="Người dùng"
          rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
        >
          <Select
            placeholder="Chọn người dùng"
            onChange={setSelectedUserId}  // Cập nhật khi chọn người dùng
          >
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Chọn playlist */}
        <Form.Item
          name="playlist_id"
          label="Playlist"
          rules={[{ required: true, message: "Vui lòng chọn playlist" }]}
        >
          <Select placeholder="Chọn playlist" disabled={!selectedUserId}>
            {playlists.map((playlist) => (
              <Option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Chọn bài hát */}
        <Form.Item
          name="song_id"
          label="Bài hát"
          rules={[{ required: true, message: "Vui lòng chọn bài hát" }]}
        >
          <Select
            showSearch
            placeholder="Nhập tên bài hát để tìm"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {songs.map((song) => (
              <Option key={song.id} value={song.id}>
                {song.song_name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Thêm vào Playlist
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddSongToPlaylist;
