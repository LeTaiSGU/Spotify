import React, { useEffect, useState } from 'react';
import { Select, Table, Image, Button, Popconfirm, message, Typography, Modal, Form, Input } from 'antd';
import axios from 'axios';
import { API_ROOT } from "~/utils/constants";
import './Modal.css';
const { Option } = Select;
const { Title } = Typography;

const EditPlaylistSongs = () => {
  const [users, setUsers] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [songsInPlaylist, setSongsInPlaylist] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  // Lấy danh sách người dùng
  useEffect(() => {
    axios.get('${API_ROOT}/api/users/getall/')
      .then(res => setUsers(res.data))
      .catch(() => message.error('Không thể tải danh sách người dùng'));
  }, []);

  // Lấy playlist của người dùng đã chọn
  useEffect(() => {
    if (selectedUser) {
      axios.get(`${API_ROOT}/api/playlists/Admin/getplaylistbyUser/${selectedUser}/`)
        .then(res => setPlaylists(res.data))
        .catch(() => message.error('Không thể tải danh sách playlist'));
    }
  }, [selectedUser]);

  // Lấy danh sách bài hát trong playlist đã chọn
  useEffect(() => {
    if (selectedPlaylist) {
      axios.get(`${API_ROOT}/api/playlist_songs/${selectedPlaylist}`)
        .then(res => setSongsInPlaylist(res.data))
        .catch(() => message.error('Không thể tải danh sách bài hát'));
    }
  }, [selectedPlaylist]);

  const handleDeleteSong = (songId) => {
    axios.delete(`${API_ROOT}/api/playlist_songs/${selectedPlaylist}/${songId}/`)
      .then(() => {
        setSongsInPlaylist(prev => prev.filter(s => s.id !== songId));
        message.success('Đã xóa bài hát khỏi playlist');
      })
      .catch(() => message.error('Xóa thất bại'));
  };

  const handleEditSong = (song) => {
    setCurrentSong(song);
    setIsModalVisible(true);
  };


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
    },
    {
      title: 'Tên bài hát',
      dataIndex: 'song_name',
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      width: 120,
    },
    {
      title: 'Ảnh',
      dataIndex: 'image',
      width: 100,
      render: (src) => <Image width={50} src={src} alt="Ảnh bài hát" />,
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      width: 180,
      render: (_, record) => (
        <>
         
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDeleteSong(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={3}>Chỉnh sửa danh sách nhạc trong Playlist</Title>

      <div style={{ marginBottom: '1.5rem' }}>
        <label><strong>Chọn người dùng: </strong></label>
        <Select
          style={{ width: 300 }}
          placeholder="Chọn người dùng"
          value={selectedUser || undefined}
          onChange={value => {
            setSelectedUser(value);
            setSelectedPlaylist(''); // reset playlist khi chọn người dùng mới
          }}
        >
          {users.map(user => (
            <Option key={user.id} value={user.id}>{user.name}</Option>
          ))}
        </Select>
      </div>

      {selectedUser && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label><strong>Chọn Playlist: </strong></label>
          <Select
            style={{ width: 300 }}
            placeholder="Chọn playlist"
            value={selectedPlaylist || undefined}
            onChange={value => setSelectedPlaylist(value)}
          >
            {playlists.map(playlist => (
              <Option key={playlist.id} value={playlist.id}>{playlist.name}</Option>
            ))}
          </Select>
        </div>
      )}

      {selectedPlaylist && (
        <Table
          dataSource={songsInPlaylist}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{ pageSize: 5 }}
        />
      )}

    </div>
  );
};

export default EditPlaylistSongs;
