import React, { useEffect, useState } from "react";
import { Form, Select, Button, message } from "antd";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";

const { Option } = Select;

const AddSongToPlaylist = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_ROOT}/api/users/getall/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setUsers(res.data))
      .catch(() => message.error("Không thể tải danh sách người dùng"));
  }, []);

  useEffect(() => {
    axios
      .get(`${API_ROOT}/api/songs/getallsong/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setSongs(res.data))
      .catch(() => message.error("Không thể tải bài hát"));
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      axios
        .get(`${API_ROOT}/api/playlists/Admin/getplaylistbyUser/${selectedUserId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => setPlaylists(res.data))
        .catch(() => message.error("Không thể tải playlist của người dùng"));
    }
  }, [selectedUserId]);

  const onFinish = async (values) => {
    const { playlist_id, song_id } = values;
    try {
      const response = await axios.post(
        `${API_ROOT}/api/playlist_songs/${playlist_id}/${song_id}/`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
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
        <Form.Item
          name="user_id"
          label="Người dùng"
          rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
        >
          <Select placeholder="Chọn người dùng" onChange={setSelectedUserId}>
            {users.map((user) => (
              <Option key={user.id} value={user.id}>
                {user.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

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
              option?.children?.toLowerCase().includes(input.toLowerCase())
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
