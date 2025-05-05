import React, { useState } from "react";
import { Modal, List, Button, Typography, Space } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

const { Text } = Typography;

const AddToPlaylistModal = ({ visible, onClose, playlists, onAddSong }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const handleAdd = () => {
    if (selectedPlaylist) {
      onAddSong(selectedPlaylist);
    }
  };

  return (
    <Modal
      title="Thêm vào danh sách phát"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="add"
          type="primary"
          onClick={handleAdd}
          disabled={!selectedPlaylist}
        >
          Thêm
        </Button>,
      ]}
    >
      <List
        dataSource={playlists}
        itemLayout="horizontal"
        renderItem={(playlist) => {
          const isSelected = selectedPlaylist === playlist.id;
          return (
            <List.Item
              onClick={() => setSelectedPlaylist(playlist.id)}
              style={{
                cursor: "pointer",
                backgroundColor: isSelected ? "#e6f7ff" : "#141414",
                border: isSelected ? "1px solid #1890ff" : "1px solid #303030",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 8,
                transition: "all 0.2s ease",
              }}
            >
              <Space size="middle" align="center">
                {isSelected && <CheckCircleTwoTone twoToneColor="#1890ff" />}
                <Text
                  strong
                  style={{ color: isSelected ? "#000" : "#fff" }}
                >
                  {playlist.name}
                </Text>
              </Space>
            </List.Item>
          );
        }}
      />
    </Modal>
  );
};

export default AddToPlaylistModal;
