import { React, useEffect } from "react";
import { Checkbox, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsersSelect,
  selectItemsUserAdmin,
} from "../../../redux/slice/userAdminSlice";
import {
  updatePlaylist,
  selectPlaylistAdmin,
  fetchPlaylistAdminById,
  selectItemsPlaylistAdmin,
  resetPlaylistSelected,
  fetchPlaylistsSelect,
} from "../../../redux/slice/playlistAdminSlide";

import {
  selectItemsSongAdmin,
  fetchSongsSelect,
} from "../../../redux/slice/songAdminSlice";
const { TextArea } = Input;

const UpdatePlaylist = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { content: songs = [] } = useSelector(selectItemsSongAdmin);
  const { content: users = [] } = useSelector(selectItemsUserAdmin); // lấy từ slice
  const { content: playlists = [] } = useSelector(selectItemsPlaylistAdmin); // lấy từ slice
  useEffect(() => {
    dispatch(fetchUsersSelect());
    dispatch(fetchSongsSelect());
    dispatch(fetchPlaylistsSelect()); // Lấy danh sách playlist
  }, [dispatch]);

  const userOptions = Array.isArray(users)
    ? users.map((user) => ({
        label: user.userName,
        value: user.userId,
      }))
    : [];

  const songOptions = Array.isArray(songs)
    ? songs.map((songs) => ({
        label: songs.songName, // tên bài hát
        value: songs.songId, // id bài hát
      }))
    : [];

  const playlistsOptions = Array.isArray(playlists)
    ? playlists.map((playlist) => ({
        label: playlist.name,
        value: playlist.playlistId,
      }))
    : [];

  const playlistDetail = useSelector(selectPlaylistAdmin);

  useEffect(() => {
    if (playlistDetail) {
      form.setFieldsValue({
        playlistId: playlistDetail.playlistId,
        name: playlistDetail.name,
        user: playlistDetail.user?.userId,
        description: playlistDetail.description,
        songs: playlistDetail.songs?.songs?.map((song) => song.songId),
        image: playlistDetail.coverImage
          ? [
              {
                uid: "-1", // uid tùy chỉnh, không trùng với bất kỳ file nào mới được upload
                name: "Ảnh hiện tại", // Tên ảnh có thể tùy chỉnh
                status: "done", // Trạng thái ảnh đã tải xong
                url: playlistDetail.coverImage, // URL của ảnh từ AWS
                thumbUrl: playlistDetail.coverImage, // Thumbnail ảnh (có thể là URL giống URL chính)
              },
            ]
          : [], // Chuyển đổi danh sách bài hát thành mảng ID
      });
    }
  }, [playlistDetail, form]);

  const selectedPlaylistId = Form.useWatch("searchPlaylist", form);

  const onSelectPlaylist = (value) => {
    dispatch(fetchPlaylistAdminById(value));
  };

  const onFinish = (values) => {
    const playlistData = {
      playlistId: values.playlistId,
      name: values.name,
      user: values.user,
      songs: values.songs,
      description: values.description,
      isPrivate: values.isPrivate,
      coverImage: values.image,
    };

    console.log("Playlist data to update:", playlistData);
    dispatch(updatePlaylist(playlistData))
      .unwrap()
      .then(() => {
        form.setFieldsValue({
          searchPlaylist: null,
        });
        dispatch(resetPlaylistSelected());
      })
      .catch((err) => {
        console.error(err);
        message.error("Tạo playlist thất bại!");
      });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
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
          label="Tìm playlist"
          required={false}
          name="searchPlaylist"
          rules={[{ required: true, message: "Chọn playlist để cập nhật" }]}
        >
          <Select
            showSearch
            options={playlistsOptions}
            placeholder="Tìm playlist"
            onChange={onSelectPlaylist}
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item label="ID playlist" name="playlistId">
          <Input placeholder="ID" disabled />
        </Form.Item>

        {/* Tên playlist */}
        <Form.Item
          label="Tên Playlist"
          name="name"
          required={false}
          rules={[{ required: true, message: "Vui lòng nhập tên playlist" }]}
        >
          <Input
            disabled={!selectedPlaylistId}
            placeholder="Nhập tên playlist..."
          />
        </Form.Item>

        {/* Select nghệ sĩ */}
        <Form.Item label="User" name="user" required={false}>
          <Select
            placeholder="Chọn user cho playlist (không bắt buộc)"
            showSearch
            optionFilterProp="label"
            disabled={!selectedPlaylistId}
            options={userOptions}
            allowClear
          />
        </Form.Item>

        {/* Mô tả */}
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <TextArea
            rows={3}
            placeholder="Nhập mô tả cho playlist..."
            disabled={!selectedPlaylistId}
          />
        </Form.Item>

        {/* Danh sách bài hát */}
        <Form.Item
          label="Danh sách bài hát"
          name="songs"
          required={false}
          rules={[{ required: true, message: "Chọn ít nhất 1 bài hát" }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn bài hát cho playlist"
            optionFilterProp="label"
            options={songOptions}
            disabled={!selectedPlaylistId}
            allowClear
          />
        </Form.Item>

        {/* Ảnh bìa */}
        <Form.Item
          label="Ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          required={false}
          rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
        >
          <Upload
            listType="picture"
            accept="image/*"
            beforeUpload={() => false}
            maxCount={1}
            disabled={!selectedPlaylistId}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          name="isPrivate"
          label="Private"
          valuePropName="checked"
          initialValue={false} // <- cái này quan trọng
        >
          <Checkbox disabled={!selectedPlaylistId} />
        </Form.Item>

        {/* Nút submit */}
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Tạo Playlist
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default UpdatePlaylist;
