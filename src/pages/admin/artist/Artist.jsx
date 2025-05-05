import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArtists,
  toggleArtistStatus,
} from "../../../redux/slice/artistSlice"; // Giả sử bạn có action này
import { Table, Button, Space, Modal, Card } from "antd";
import AdminTable from "../../../components/admin/ui/Table"; // Giả sử bạn có component này

const Artist = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});

  useEffect(() => {
    dispatch(fetchArtists({ pageNo: 0, pageSize: 10 }));
  }, [dispatch]);

  const {
    content: artists = [],
    pageNo = 0,
    pageSize = 10,
    totalElements = 0,
  } = useSelector((state) => state.artist.items || {});

  const handleStatusChange = (artistId) => {
    // Cập nhật trạng thái artist (Active/Inactive)
    dispatch(toggleArtistStatus(artistId));
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupData, setPopupData] = useState({ type: "", songs: [] });

  const columns = [
    {
      title: "ID",
      dataIndex: "artistId",
      key: "artistId",
      sorter: (a, b) => a.artistId - b.artistId,
      sortOrder: sortedInfo.columnKey === "artistId" ? sortedInfo.order : null,
    },
    {
      title: "Tên nghệ sĩ",
      dataIndex: "name",
      key: "name",
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
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Ngày khởi tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortOrder: sortedInfo.columnKey === "createdAt" ? sortedInfo.order : null,
    },
    {
      title: "Bài hát sở hữu",
      dataIndex: "songs",
      key: "songs",
      render: (songs) => (
        <Button
          onClick={() => {
            setPopupData({ type: "Sở hữu", songs: songs });
            setIsModalVisible(true);
          }}
          disabled={!songs || songs.length === 0} // Kiểm tra nếu mảng rỗng hoặc undefined
        >
          Xem
        </Button>
      ),
    },
    {
      title: "Bài hát tham gia",
      dataIndex: "featuredSongs",
      key: "featuredSongs",
      render: (featuredSongs) => (
        <Button
          onClick={() => {
            setPopupData({ type: "Tham gia", songs: featuredSongs });
            setIsModalVisible(true);
          }}
          disabled={!featuredSongs || featuredSongs.length === 0} // Kiểm tra nếu mảng rỗng hoặc undefined
        >
          Xem
        </Button>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.artistId)}
            type={status ? "default" : "primary"}
            danger={status} // nút màu đỏ nếu đang active
          >
            {status ? "Hủy" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (pagination, sorter) => {
    setSortedInfo(sorter);
    dispatch(
      fetchArtists({
        pageNo: pagination.current - 1,
        pageSize: pagination.pageSize,
      })
    );
  };

  const clearSort = () => {
    setSortedInfo({});
  };

  return (
    <div className="p-4">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearSort}>Clear</Button>
      </Space>
      <Modal
        title={`Danh sách bài hát ${popupData.type}`}
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Card>
          <ul>
            {popupData.songs.length > 0 ? (
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
        dataSource={artists}
        rowKey="artistId"
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Artist;
