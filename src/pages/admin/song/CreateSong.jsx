import { useEffect, React, useState } from "react";
import { Button, DatePicker, Form, Upload, Input, Select, message } from "antd";
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

import {
  createSong,
  selectSongLoading,
} from "../../../redux/slice/songAdminSlice";

const { TextArea } = Input;

const CreateSong = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const artistsData = useSelector(selectItemsArtist);
  const albumsData = useSelector(selectItemsAlbum);
  const isLoading = useSelector(selectSongLoading);

  // Xử lý dữ liệu để phù hợp với cả hai định dạng trả về
  // (mảng trực tiếp hoặc đối tượng có thuộc tính content)
  const artists = Array.isArray(artistsData)
    ? artistsData
    : artistsData?.content || [];

  const albums = Array.isArray(albumsData)
    ? albumsData
    : albumsData?.content || [];

  useEffect(() => {
    dispatch(fetchArtistsSelect());
    dispatch(fetchAlbumsSelect());
  }, [dispatch]);

  const artistOptions = artists.map((artist) => ({
    label: artist.name,
    value: artist.id,
  }));

  const albumOptions = albums.map((album) => ({
    label: album.title,
    value: album.id,
  }));

  const [durationInSeconds, setDurationInSeconds] = useState(null);
  const [mainArtist, setMainArtist] = useState(null);
  const [formattedDuration, setFormattedDuration] = useState("");

  const onFinish = (values) => {
    const songData = {
      songName: values.songName,
      description: values.description || "",
      albumId: values.album,
      artistOwnerId: values.artist,
      duration: durationInSeconds,
      image: values.image,
      fileUpload: values.audio,
      video_upload: values.mv,
      artists: values.featuredArtists || [],
      // Add any additional fields needed by your API
    };

    dispatch(createSong(songData))
      .unwrap()
      .then(() => {
        message.success("Thêm bài hát thành công!");
        form.resetFields();
        setFormattedDuration("");
        setDurationInSeconds(null);
        setMainArtist(null);
      })
      .catch((err) => {
        console.error(err);
        message.error(
          "Thêm bài hát thất bại: " + (err?.message || "Lỗi không xác định")
        );
      });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const getDuration = (file) => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";

      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(Math.floor(audio.duration));
      };

      audio.onerror = () => {
        reject("Không thể đọc thời lượng của file.");
      };

      audio.src = URL.createObjectURL(file);
    });
  };

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

        {/* Mô tả */}
        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} placeholder="Mô tả bài hát (không bắt buộc)" />
        </Form.Item>

        {/* Nghệ sĩ chính */}
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
              form.setFieldsValue({ featuredArtists: [] });
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
              (artist) => artist.value !== mainArtist
            )}
            allowClear
            disabled={!mainArtist}
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
          getValueFromEvent={normFile}
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
            <Button icon={<UploadOutlined />}>Chọn nhạc (.mp3)</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="File MV"
          required={false}
          name="mv"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: false, message: "Vui lòng chọn file MV (.mp4)" }]}
        >
          <Upload
            name="mv"
            listType="text"
            accept=".mp4"
            maxCount={1}
            multiple={false}
            beforeUpload={() => false}
          >
            <Button icon={<UploadOutlined />}>Chọn MV (.mp4)</Button>
          </Upload>
        </Form.Item>

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
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Lưu bài hát
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateSong;
