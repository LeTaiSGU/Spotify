import { useEffect, React, useState } from "react";

import {
  InputNumber,
  Button,
  DatePicker,
  Form,
  Upload,
  Input,
  Select,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchArtistsSelect,
  selectItemsArtist,
} from "../../../redux/slice/artistSlice";

import {
  fetchAlbumsSelect,
  selectItemsAlbum,
} from "../../../redux/slice/albumSlice";

import { createSong } from "../../../redux/slice/songAdminSlice"; // Tạo action này nhé

const { TextArea } = Input;

const CreateSong = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { content: artists = [] } = useSelector(selectItemsArtist);
  const { content: albums = [] } = useSelector(selectItemsAlbum);

  useEffect(() => {
    dispatch(fetchArtistsSelect());
    dispatch(fetchAlbumsSelect());
  }, [dispatch]);

  const artistOptions = Array.isArray(artists)
    ? artists.map((artist) => ({
        label: artist.name,
        value: artist.artistId,
      }))
    : [];

  const albumOptions = Array.isArray(albums)
    ? albums.map((album) => ({
        label: album.title,
        value: album.albumId,
      }))
    : [];
  const [durationInSeconds, setDurationInSeconds] = useState(null);

  const onFinish = (values) => {
    const songData = {
      songName: values.songName,
      releaseDate: values.releaseDate.format("YYYY-MM-DD"),
      artistId: values.artist,
      albumId: values.album,
      duration: durationInSeconds,
      image: values.image,
      audio: values.audio,
      featuredArtists: values.featuredArtists,
    };
    // Kiểm tra dữ liệu trước khi gửi đi
    dispatch(createSong(songData))
      .unwrap()
      .then(() => {
        message.success("Thêm bài hát thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error(err);
        message.error("Thêm bài hát thất bại!");
      });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };
  // Đặt ở ngoài component để xài lại được
  const getDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(Math.floor(audio.duration)); // tính theo giây, làm tròn
      };

      audio.onerror = () => {
        reject("Không thể đọc thời lượng của file.");
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  const [mainArtist, setMainArtist] = useState(null);

  const [formattedDuration, setFormattedDuration] = useState("");
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
        {/* Tên bài hát */}
        <Form.Item
          label="Tên bài hát"
          name="songName"
          rules={[{ required: true, message: "Vui lòng nhập tên bài hát" }]}
          required={false}
        >
          <Input placeholder="Nhập tên bài hát..." />
        </Form.Item>

        {/* Ngày phát hành */}
        <Form.Item
          label="Ngày phát hành"
          required={false}
          name="releaseDate"
          rules={[{ required: true, message: "Chọn ngày phát hành" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            placeholder="Chọn ngày phát hành"
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
          />
        </Form.Item>

        {/* Nghệ sĩ */}
        <Form.Item
          label="Nghệ sĩ chính"
          required={false}
          name="artist"
          rules={[{ required: true, message: "Chọn nghệ sĩ chính" }]}
        >
          <Select
            placeholder="Chọn nghệ sĩ"
            showSearch
            optionFilterProp="label"
            options={artistOptions}
            allowClear
            onChange={(value) => {
              setMainArtist(value);
              form.setFieldsValue({ featuredArtists: [] }); // reset
            }}
          />
        </Form.Item>

        {/* Album liên quan */}
        <Form.Item
          label="Album"
          required={false}
          name="album"
          rules={[{ required: true, message: "Chọn album" }]}
        >
          <Select
            placeholder="Chọn album"
            showSearch
            optionFilterProp="label"
            options={albumOptions}
            allowClear
          />
        </Form.Item>

        <Form.Item label="Nghệ sĩ tham gia" name="featuredArtists">
          <Select
            mode="multiple"
            placeholder="Chọn nghệ sĩ tham gia"
            optionFilterProp="label"
            options={artistOptions.filter(
              (artist) => artist.value !== mainArtist // ← lọc bỏ người đã chọn ở trên
            )}
            allowClear
            disabled={!mainArtist} // ← disable nếu chưa chọn artist chính
          />
        </Form.Item>

        {/* Ảnh bìa */}
        <Form.Item
          label="Ảnh bìa"
          required={false}
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
        >
          <Upload
            listType="picture"
            accept="image/*"
            beforeUpload={() => false}
            maxCount={1}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* File nhạc */}
        <Form.Item
          label="File nhạc"
          required={false}
          name="audio"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          rules={[
            { required: true, message: "Vui lòng chọn file nhạc (.mp3)" },
          ]}
        >
          <Upload
            name="audio"
            listType="text"
            accept=".mp3"
            maxCount={1}
            multiple={false}
            beforeUpload={async (file) => {
              const duration = await getDuration(file);
              form.setFieldsValue({ duration }); // để truyền lên khi submit
              setDurationInSeconds(duration); // ← lưu giá trị duration (giây)
              setFormattedDuration(formatDuration(duration)); // ← để hiển thị string đẹp

              return false; // không upload ngay
            }}
          >
            <Button icon={<UploadOutlined />}>Chọn nhạc (.mp3)</Button>
          </Upload>
        </Form.Item>
        {/* Mô tả */}
        <Form.Item label="Thời lượng">
          <Input
            style={{ width: 60, textAlign: "center" }}
            value={formattedDuration}
            placeholder="0:00"
            disabled
          />
        </Form.Item>
        {/* Nút submit */}
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Lưu bài hát
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateSong;
