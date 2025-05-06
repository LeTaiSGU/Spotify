import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPlaylistsAdmin,
  togglePlaylistStatus,
} from "../../../redux/slice/playlistAdminSlide"; // Giả sử bạn có action này
import { Button, Modal, Space, Card } from "antd";
import AdminTable from "../../../components/admin/ui/Table"; // Giả sử bạn có component này

const Playlist = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    dispatch(fetchPlaylistsAdmin({ pageNo: 0, pageSize: 10 }));
  }, [dispatch]);

  const {
    content: playlistsAdmin = [],
    pageNo = 0,
    pageSize = 10,
    totalElements = 0,
  } = useSelector((state) => state.playlistAdmin.items || {});

  const handleStatusChange = (playlistId) => {
    dispatch(togglePlaylistStatus(playlistId));
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "playlistId", // Cập nhật tên cột
      key: "playlistId",
      sorter: (a, b) => a.playlistId - b.playlistId,
      sortOrder:
        sortedInfo.columnKey === "playlistId" ? sortedInfo.order : null,
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
      dataIndex: ["user", "userName"], // ← hoặc dùng render như bên dưới
      key: "user",
      sorter: (a, b) => a.user.userName.localeCompare(b.user.userName),
      sortOrder: sortedInfo.columnKey === "user" ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
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
      title: "Bài hát sở hữu",
      dataIndex: "songs",
      key: "songs",
      render: (songs) => (
        <Button
          onClick={() => {
            setPopupData({ type: "Sở hữu", songs: songs?.songs });
            setIsModalVisible(true);
            console.log("songs", songs?.songs);
          }}
          disabled={!songs || songs.length === 0} // Kiểm tra nếu mảng rỗng hoặc undefined
        >
          Xem
        </Button>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isPrivate", // Cập nhật tên cột
      key: "isPrivate",
      render: (isPrivate, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.playlistId)}
            type={isPrivate ? "default" : "primary"}
            danger={isPrivate} // nút màu đỏ nếu đang private
          >
            {isPrivate ? "Hủy" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (pagination, filter, sorter) => {
    setSortedInfo(sorter);
    dispatch(
      fetchPlaylistsAdmin({
        pageNo: pagination.current - 1,
        pageSize: pagination.pageSize,
      })
    );
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupData, setPopupData] = useState({ type: "", songs: [] });

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
        rowKey="playlistId"
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Playlist;
