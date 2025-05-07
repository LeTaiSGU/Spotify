import { useEffect, useState } from "react";
import { Button, Form, Upload, Input, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArtistsSelect,
  selectItemsArtist,
} from "../../../redux/slice/artistSlice";
import {
  fetchAlbumsSelect,
  selectItemsAlbum,
} from "../../../redux/slice/albumSlice";
import {
  fetchSongsSelect,
  fetchSongAdminById,
  updateSong,
  selectSongAdmin,
  selectItemsSongAdmin,
  resetSongSelected,
  selectSongLoading,
} from "../../../redux/slice/songAdminSlice";

const { TextArea } = Input;

const UpdateSong = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const artistsData = useSelector(selectItemsArtist);
  const albumsData = useSelector(selectItemsAlbum);
  const songsData = useSelector(selectItemsSongAdmin);
  const songDetail = useSelector(selectSongAdmin);
  const isLoading = useSelector(selectSongLoading);

  // Xử lý dữ liệu để phù hợp với cả hai định dạng trả về
  const artists = Array.isArray(artistsData)
    ? artistsData
    : artistsData?.content || [];

  const albums = Array.isArray(albumsData)
    ? albumsData
    : albumsData?.content || [];

  const songs = Array.isArray(songsData) ? songsData : songsData?.content || [];

  const [durationInSeconds, setDurationInSeconds] = useState(null);
  const [formattedDuration, setFormattedDuration] = useState("");
  const [selectedMainArtist, setSelectedMainArtist] = useState(null);

  useEffect(() => {
    dispatch(resetSongSelected());
    dispatch(fetchArtistsSelect());
    dispatch(fetchAlbumsSelect());
    dispatch(fetchSongsSelect());
  }, [dispatch]);

  useEffect(() => {
    if (songDetail && songDetail.id) {
      // Chuyển đổi duration từ chuỗi sang số giây
      const durationInSecs = parseTimeStringToSeconds(songDetail.duration);
      setDurationInSeconds(durationInSecs);

      // Hiển thị duration theo định dạng MM:SS
      setFormattedDuration(
        durationInSecs ? formatDuration(durationInSecs) : ""
      );

      setSelectedMainArtist(songDetail.artist_owner);

      console.log("Song duration from DB:", songDetail.duration);
      console.log("Converted to seconds:", durationInSecs);

      form.setFieldsValue({
        songName: songDetail.song_name,
        description: songDetail.description || "",
        artistOwnerId: songDetail.artist_owner,
        albumId: songDetail.album,
        artists: songDetail.artists || [],
        image: songDetail.img
          ? [
              {
                uid: "-1",
                name: "Ảnh hiện tại",
                status: "done",
                url: songDetail.img,
                thumbUrl: songDetail.img,
              },
            ]
          : [],
        fileUpload: songDetail.file_upload
          ? [
              {
                uid: "-1",
                name: songDetail.song_name,
                status: "done",
                url: songDetail.file_upload,
                thumbUrl: songDetail.file_upload,
              },
            ]
          : [],
      });
    }
  }, [songDetail, form]);

  // Log để debug
  useEffect(() => {
    console.log("Songs data from store:", songsData);
    console.log("Processed songs array:", songs);
  }, [songsData, songs]);

  const artistOptions = artists.map((artist) => ({
    label: artist.name,
    value: artist.id,
  }));

  const albumOptions = albums.map((album) => ({
    label: album.title,
    value: album.id,
  }));

  const songOptions = songs.map((song) => ({
    label: song.song_name,
    value: song.id,
  }));

  const selectedSongId = Form.useWatch("searchSong", form);

  const onSelectSong = (value) => {
    dispatch(fetchSongAdminById(value));
  };

  const getDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(Math.floor(audio.duration));
      };

      audio.onerror = () => reject("Không thể đọc thời lượng của file.");
      audio.src = URL.createObjectURL(file);
    });
  };

  // Sửa lại function formatDuration để hiển thị đúng dạng HH:MM:SS nếu cần
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Nếu có giờ, hiển thị cả giờ
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }

    // Nếu không có giờ, chỉ hiển thị phút và giây
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseTimeStringToSeconds = (timeString) => {
    if (!timeString) return 0;

    // Xử lý chuỗi dạng "HH:MM:SS"
    if (timeString.includes(":")) {
      const parts = timeString.split(":");

      if (parts.length === 3) {
        // Format "HH:MM:SS"
        const hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;
        const seconds = parseInt(parts[2], 10) || 0;
        return hours * 3600 + minutes * 60 + seconds;
      } else if (parts.length === 2) {
        // Format "MM:SS"
        const minutes = parseInt(parts[0], 10) || 0;
        const seconds = parseInt(parts[1], 10) || 0;
        return minutes * 60 + seconds;
      }
    }

    // Nếu không phải định dạng thời gian, thử chuyển thành số
    return parseInt(timeString, 10) || 0;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish = (values) => {
    const songData = {
      id: selectedSongId,
      songName: values.songName,
      description: values.description || "",
      albumId: values.albumId,
      artistOwnerId: values.artistOwnerId,
      duration: durationInSeconds,
      artists: values.artists || [],
      image: values.image,
      fileUpload: values.fileUpload,
    };

    dispatch(updateSong(songData))
      .unwrap()
      .then(() => {
        message.success("Cập nhật thành công!");
        form.setFieldsValue({
          searchSong: null,
        });
        dispatch(resetSongSelected());
      })
      .catch((error) => {
        message.error(
          "Cập nhật thất bại: " + (error?.message || "Lỗi không xác định")
        );
      });
  };

  return (
    <div className="p-4 flex justify-center items-center">
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 15 }}
        layout="horizontal"
        size="middle"
        style={{ maxWidth: 1000, width: "100%" }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Tìm bài hát"
          required={false}
          name="searchSong"
          rules={[{ required: true, message: "Chọn bài hát để cập nhật" }]}
        >
          <Select
            showSearch
            options={songOptions}
            placeholder="Tìm bài hát"
            onChange={onSelectSong}
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          label="Tên bài hát"
          required={false}
          name="songName"
          rules={[{ required: true, message: "Nhập tên bài hát" }]}
        >
          <Input placeholder="Nhập tên bài hát" disabled={!selectedSongId} />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea
            rows={4}
            placeholder="Mô tả bài hát (không bắt buộc)"
            disabled={!selectedSongId}
          />
        </Form.Item>

        <Form.Item
          label="Nghệ sĩ chính"
          required={false}
          name="artistOwnerId"
          rules={[{ required: true, message: "Chọn nghệ sĩ chính" }]}
        >
          <Select
            placeholder="Chọn nghệ sĩ chính"
            options={artistOptions}
            disabled={!selectedSongId}
            onChange={(value) => {
              setSelectedMainArtist(value);
              form.setFieldsValue({ artists: [] });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Album"
          required={false}
          name="albumId"
          rules={[{ required: true, message: "Chọn album" }]}
        >
          <Select
            placeholder="Chọn album"
            options={albumOptions}
            disabled={!selectedSongId}
          />
        </Form.Item>

        <Form.Item label="Nghệ sĩ tham gia" name="artists">
          <Select
            mode="multiple"
            placeholder="Chọn nghệ sĩ tham gia (không bắt buộc)"
            options={artistOptions.filter(
              (a) => a.value !== selectedMainArtist
            )}
            allowClear
            disabled={!selectedMainArtist}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh bìa"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="picture"
            accept="image/*"
            maxCount={1}
            beforeUpload={() => false}
            multiple={false}
            disabled={!selectedSongId}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh bìa</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="File nhạc"
          name="fileUpload"
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload
            listType="text"
            accept=".mp3"
            maxCount={1}
            multiple={false}
            disabled={!selectedSongId}
            beforeUpload={async (file) => {
              try {
                const duration = await getDuration(file);
                setDurationInSeconds(duration);
                setFormattedDuration(formatDuration(duration));
              } catch (error) {
                console.error("Error getting audio duration:", error);
                message.error("Không thể đọc thời lượng file âm thanh");
              }
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn file nhạc (.mp3)</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Thời lượng">
          <Input
            disabled
            style={{ width: 60, textAlign: "center" }}
            value={formattedDuration}
            placeholder="0:00"
          />
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            disabled={!selectedSongId}
            loading={isLoading}
          >
            Cập nhật bài hát
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateSong;
