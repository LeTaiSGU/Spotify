import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Modal, Space, Card, message } from "antd";
import {
  fetchSongsAdmin,
  toggleSongStatus,
  selectItemsSongAdmin,
  selectSongLoading,
} from "../../../redux/slice/songAdminSlice";
import {
  fetchAlbumsSelect,
  selectItemsAlbum,
} from "../../../redux/slice/albumSlice";
import {
  fetchArtistsSelect,
  selectItemsArtist,
} from "../../../redux/slice/artistSlice";
import AdminTable from "../../../components/admin/ui/Table";

const Songs = () => {
  const dispatch = useDispatch();
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);

  // Lấy danh sách album và artist để có thể hiển thị tên thay vì ID
  const albums = useSelector(selectItemsAlbum);
  const artists = useSelector(selectItemsArtist);

  // Chuyển đổi thành object để tìm kiếm nhanh hơn
  const [albumMap, setAlbumMap] = useState({});
  const [artistMap, setArtistMap] = useState({});

  useEffect(() => {
    // Fetch songs và cả albums, artists để hiển thị tên
    setLoading(true);

    Promise.all([
      dispatch(fetchSongsAdmin({ pageNo: 0, pageSize: 10 })).unwrap(),
      dispatch(fetchAlbumsSelect()).unwrap(),
      dispatch(fetchArtistsSelect()).unwrap(),
    ])
      .then(([songsData, albumsData, artistsData]) => {
        setLoading(false);
        // Log dữ liệu trả về để debug
        console.log("Songs data:", songsData);
        console.log("Albums data:", albumsData);
        console.log("Artists data:", artistsData);
      })
      .catch((err) => {
        setLoading(false);
        message.error("Không thể tải dữ liệu: " + (err.message || "Lỗi"));
      });
  }, [dispatch]);

  // Tạo map cho album và artist để tìm kiếm nhanh dựa vào ID
  useEffect(() => {
    // Xử lý albums
    const albumsArray = Array.isArray(albums) ? albums : albums?.content || [];
    const albumObj = {};
    albumsArray.forEach((album) => {
      albumObj[album.id] = album;
    });
    setAlbumMap(albumObj);

    // Xử lý artists
    const artistsArray = Array.isArray(artists)
      ? artists
      : artists?.content || [];
    const artistObj = {};
    artistsArray.forEach((artist) => {
      artistObj[artist.id] = artist;
    });
    setArtistMap(artistObj);
  }, [albums, artists]);

  // Điều chỉnh để xử lý cấu trúc dữ liệu từ API Django
  const songsData = useSelector(selectItemsSongAdmin);
  const isLoading = useSelector(selectSongLoading);

  // Xử lý cả hai định dạng dữ liệu (phân trang hoặc mảng đơn giản)
  const songs = Array.isArray(songsData) ? songsData : songsData?.content || [];
  const pageNo = songsData?.pageNo || 0;
  const pageSize = songsData?.pageSize || 10;
  const totalElements = songsData?.totalElements || songs.length;

  const handleStatusChange = (songId) => {
    setLoading(true);
    dispatch(toggleSongStatus(songId))
      .unwrap()
      .then(() => {
        setLoading(false);
        message.success("Đã cập nhật trạng thái bài hát");
      })
      .catch((err) => {
        setLoading(false);
        message.error(
          "Không thể cập nhật trạng thái: " + (err.message || "Lỗi")
        );
      });
  };

  const formatDuration = (durationStr) => {
    if (!durationStr) return "0:00";

    try {
      if (typeof durationStr === "number") {
        const minutes = Math.floor(durationStr / 60);
        const seconds = durationStr % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }

      const parts = durationStr.split(":");
      if (parts.length === 3) {
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        const seconds = parseInt(parts[2]);

        if (hours > 0) {
          return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
        } else {
          return `${minutes}:${seconds.toString().padStart(2, "0")}`;
        }
      } else if (parts.length === 2) {
        return durationStr;
      }

      return durationStr;
    } catch (e) {
      return durationStr;
    }
  };

  // Cập nhật các columns để sử dụng albumMap và artistMap
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
    },
    {
      title: "Album",
      dataIndex: "album",
      key: "album",
      render: (albumId, record) => {
        if (albumId && typeof albumId === "object" && albumId.title) {
          return albumId.title;
        }

        if (
          albumId &&
          (typeof albumId === "string" || typeof albumId === "number")
        ) {
          return albumMap[albumId]?.title || `Album ID: ${albumId}`;
        }

        return "N/A";
      },
    },
    {
      title: "Nghệ sĩ sở hữu",
      dataIndex: "artist_owner",
      key: "artist_owner",
      render: (artistId, record) => {
        if (artistId && typeof artistId === "object" && artistId.name) {
          return artistId.name;
        }

        if (
          artistId &&
          (typeof artistId === "string" || typeof artistId === "number")
        ) {
          return artistMap[artistId]?.name || `Artist ID: ${artistId}`;
        }

        return "N/A";
      },
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => formatDuration(duration),
    },
    {
      title: "Nghệ sĩ tham gia",
      dataIndex: "artists",
      key: "artists",
      render: (artists, record) => {
        if (Array.isArray(artists) && artists.length > 0 && artists[0].name) {
          return artists.map((artist) => artist.name).join(", ");
        }

        if (Array.isArray(artists) && artists.length > 0) {
          const artistNames = artists.map((id) => {
            if (typeof id === "object" && id.name) return id.name;
            return artistMap[id]?.name || `ID: ${id}`;
          });
          return artistNames.join(", ");
        }

        return "";
      },
      ellipsis: true,
    },
    {
      title: "Hình ảnh",
      dataIndex: "img",
      key: "img",
      render: (url) => {
        if (!url) return <span>Không có ảnh</span>;

        return (
          <img
            src={url}
            alt="Cover"
            style={{ width: 40, height: 40, objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/40";
            }}
          />
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Space>
          <Button
            onClick={() => handleStatusChange(record.id)}
            type={status ? "default" : "primary"}
            danger={status}
            loading={loading}
          >
            {status ? "Hủy" : "Kích hoạt"}
          </Button>
        </Space>
      ),
    },
  ];

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
    dispatch(
      fetchSongsAdmin({
        pageNo: pagination.current,
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
          onClick={() => {
            setLoading(true);
            Promise.all([
              dispatch(fetchSongsAdmin({ pageNo: 0, pageSize: 10 })).unwrap(),
              dispatch(fetchAlbumsSelect()).unwrap(),
              dispatch(fetchArtistsSelect()).unwrap(),
            ])
              .then(() => setLoading(false))
              .catch((err) => {
                setLoading(false);
                message.error(
                  "Không thể tải lại dữ liệu: " + (err.message || "Lỗi")
                );
              });
          }}
        >
          Làm mới
        </Button>
      </Space>
      <AdminTable
        columns={columns}
        dataSource={songs}
        rowKey="id"
        loading={isLoading || loading}
        handleChange={handleChange}
        pageNo={pageNo}
        pageSize={8}
        totalElements={totalElements}
      />
    </div>
  );
};

export default Songs;
