import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Upload, Input, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
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
} from "../../../redux/slice/songAdminSlice";

const { TextArea } = Input;

const UpdateSong = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { content: artists = [] } = useSelector(selectItemsArtist);
  const { content: albums = [] } = useSelector(selectItemsAlbum);
  const { content: songs = [] } = useSelector(selectItemsSongAdmin);

  const [durationInSeconds, setDurationInSeconds] = useState(null);
  const [formattedDuration, setFormattedDuration] = useState("");
  //   const [mainArtist, setMainArtist] = useState(null);

  useEffect(() => {
    dispatch(resetSongSelected());
    dispatch(fetchArtistsSelect());
    dispatch(fetchAlbumsSelect());
    dispatch(fetchSongsSelect());
  }, [dispatch]);

  const songDetail = useSelector(selectSongAdmin);

  useEffect(() => {
    if (songDetail) {
      // Set the initial song data when songDetail is available
      setDurationInSeconds(songDetail.duration || null); // Use the duration from the API if available
      setFormattedDuration(
        songDetail.duration ? formatDuration(songDetail.duration) : ""
      ); // Format the duration from the API if available

      form.setFieldsValue({
        songId: songDetail.songId,
        songName: songDetail.songName,
        releaseDate: dayjs(songDetail.releaseDate),
        artist: songDetail.artistId,
        album: songDetail.albumId,
        duration: formatDuration(songDetail.duration),
        featuredArtists: songDetail.featuredArtists?.map(
          (artist) => artist.artistId
        ),
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
        audio: songDetail.fileUpload
          ? [
              {
                uid: "-1",
                name: songDetail.songName,
                status: "done",
                url: songDetail.fileUpload,
                thumbUrl: songDetail.fileUpload,
              },
            ]
          : [],
      });
    }
  }, [songDetail, form]);

  const artistOptions = artists.map((artist) => ({
    label: artist.name,
    value: artist.artistId,
  }));

  const albumOptions = albums.map((album) => ({
    label: album.title,
    value: album.albumId,
  }));

  const songOptions = songs.map((song) => ({
    label: song.songName,
    value: song.songId,
  }));

  const selectedSongId = Form.useWatch("searchSong", form); // Check đã chọn bài hát chưa
  const selectedMainArtist = Form.useWatch("artist", form); // Check đã chọn artist chính chưa

  const onSelectSong = (value) => {
    dispatch(fetchSongAdminById(value));
  };

  const getDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(Math.floor(audio.duration)); // Thời gian tính bằng giây
      };

      audio.onerror = () => reject("Không thể đọc thời lượng của file.");
      audio.src = URL.createObjectURL(file);
    });
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const onFinish = (values) => {
    const songData = {
      songId: values.songId,
      songName: values.songName,
      releaseDate: values.releaseDate.format("YYYY-MM-DD"),
      artistId: values.artist,
      albumId: values.album,
      duration: durationInSeconds,
      featuredArtists: values.featuredArtists,
      image:
        values.image && values.image[0]?.originFileObj
          ? values.image[0].originFileObj
          : null,
      audio:
        values.audio && values.audio[0]?.originFileObj
          ? values.audio[0].originFileObj
          : null,
    };

    dispatch(updateSong(songData))
      .unwrap()
      .then(() => {
        message.success("Cập nhật thành công!");
        form.setFieldsValue({
          searchSong: null,
        });
        dispatch(resetSongSelected()); // Reset song selected after update
      })
      .catch(() => message.error("Cập nhật thất bại!"));
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

        <Form.Item label="ID bài hát" name="songId">
          <Input placeholder="ID" disabled />
        </Form.Item>

        <Form.Item
          label="Tên bài hát"
          required={false}
          name="songName"
          rules={[{ required: true }]}
        >
          <Input placeholder="Nhập tên bài hát" disabled={!selectedSongId} />
        </Form.Item>

        <Form.Item
          label="Ngày phát hành"
          required={false}
          name="releaseDate"
          rules={[{ required: true, message: "Chọn ngày phát hành" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Chọn ngày phát hành"
            disabled={!selectedSongId}
          />
        </Form.Item>

        <Form.Item
          label="Nghệ sĩ chính"
          required={false}
          name="artist"
          rules={[{ required: true, message: "Chọn nghệ sĩ chính" }]}
        >
          <Select
            placeholder="Chọn nghệ sĩ chính"
            options={artistOptions}
            disabled={!selectedSongId}
            onChange={() => {
              form.setFieldsValue({ featuredArtists: [] });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Album"
          required={false}
          name="album"
          rules={[{ required: true, message: "Chọn album" }]}
        >
          <Select
            placeholder="Chọn album"
            options={albumOptions}
            disabled={!selectedSongId}
          />
        </Form.Item>

        <Form.Item label="Nghệ sĩ tham gia" name="featuredArtists">
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
          required={false}
          name="image"
          rules={[{ required: true, message: "Chọn ảnh bìa" }]}
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
          required={false}
          name="audio"
          rules={[{ required: true, message: "Chọn file nhạc" }]}
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
              const duration = await getDuration(file);
              setDurationInSeconds(duration);
              setFormattedDuration(formatDuration(duration));

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
          <Button type="primary" htmlType="submit">
            Cập nhật bài hát
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateSong;
