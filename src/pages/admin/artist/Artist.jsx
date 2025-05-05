import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArtists,
  toggleArtistStatus,
  selectItemsArtist,
} from "../../../redux/slice/artistSlice";
import { Table, Button, Space, Modal, Card, message } from "antd";
import AdminTable from "../../../components/admin/ui/Table";

const Artist = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchArtists({ pageNo: 0, pageSize: 10 }))
      .unwrap()
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        message.error(
          "Không thể tải danh sách nghệ sĩ: " + (err.message || "Lỗi")
        );
      });
  }, [dispatch]);

  // Điều chỉnh để xử lý cấu trúc dữ liệu từ API Django
  const artistsData = useSelector(selectItemsArtist);

  // Xử lý cả hai định dạng dữ liệu (phân trang hoặc mảng đơn giản)
  const artists = Array.isArray(artistsData)
    ? artistsData
    : artistsData?.content || [];
  const pageNo = artistsData?.pageNo || 0;
  const pageSize = artistsData?.pageSize || 10;
  const totalElements = artistsData?.totalElements || artists.length;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [popupData, setPopupData] = useState({ type: "", songs: [] });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
      sortOrder: sortedInfo.columnKey === "id" ? sortedInfo.order : null,
    },
    {
      title: "Tên nghệ sĩ",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "avatar", // Thay đổi từ img/image thành avatar theo model
      key: "avatar",
      render: (url) => (
        <img
          src={url}
          alt="Avatar"
          style={{ width: 40, height: 40, objectFit: "cover" }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/40";
          }}
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
      dataIndex: "created_at", // Thay đổi từ createdAt thành created_at theo quy ước Django
      key: "created_at",
      render: (date) => (date ? new Date(date).toLocaleString() : "N/A"),
      sorter: (a, b) =>
        new Date(a.created_at || 0) - new Date(b.created_at || 0),
      sortOrder:
        sortedInfo.columnKey === "created_at" ? sortedInfo.order : null,
    },
    {
      title: "Bài hát sở hữu",
      dataIndex: "songs",
      key: "songs",
      render: (songs) => (
        <Button
          onClick={() => {
            setPopupData({ type: "Sở hữu", songs: songs || [] });
            setIsModalVisible(true);
          }}
          disabled={!songs || songs.length === 0} // Kiểm tra nếu mảng rỗng hoặc undefined
        >
          Xem ({songs?.length || 0})
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
            setPopupData({ type: "Tham gia", songs: featuredSongs || [] });
            setIsModalVisible(true);
          }}
          disabled={!featuredSongs || featuredSongs.length === 0} // Kiểm tra nếu mảng rỗng hoặc undefined
        >
          Xem ({featuredSongs?.length || 0})
        </Button>
      ),
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
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
        <Button onClick={clearSort}>Xóa bộ lọc</Button>
        <Button
          type="primary"
          onClick={() => dispatch(fetchArtists({ pageNo: 0, pageSize: 10 }))}
        >
          Làm mới
        </Button>
      </Space>
      <Modal
        title={`Danh sách bài hát ${popupData.type}`}
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
      >
        <Card>
          <ul>
            {popupData.songs && popupData.songs.length > 0 ? (
              popupData.songs.map((song, index) => (
                <li key={index}>
                  Bài hát #{song.songId || song.id} -{" "}
                  {song.songName || song.name}
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
        rowKey={(record) => record.artistId || record.id} // Hỗ trợ cả hai dạng ID
        loading={loading}
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={pageSize}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Artist;
