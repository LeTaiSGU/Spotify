import { React, useEffect } from "react";
import { Checkbox, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUsersSelect,
  selectItemsUserAdmin,
} from "../../../redux/slice/userAdminSlice";
import { createPlaylist } from "../../../redux/slice/playlistAdminSlide";

import {
  selectItemsSongAdmin,
  fetchSongsSelect,
} from "../../../redux/slice/songAdminSlice";
const { TextArea } = Input;

const CreatePlaylist = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { content: songs = [] } = useSelector(selectItemsSongAdmin);
  const { content: users = [] } = useSelector(selectItemsUserAdmin); // lấy từ slice

  useEffect(() => {
    dispatch(fetchUsersSelect());
    dispatch(fetchSongsSelect());
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

  const onFinish = (values) => {
    console.log(" dưqdwqdwqwdw", values.isPrivate);
    console.log("values", values);
    const playlistData = {
      name: values.name,
      userId: values.user || null,
      songs: values.songs,
      description: values.description,
      isPrivate: values.isPrivate,
      coverImage: values.image,
    };

    dispatch(createPlaylist(playlistData))
      .unwrap()
      .then(() => {
        message.success("Tạo playlist thành công!");
        form.resetFields();
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
        {/* Tên playlist */}
        <Form.Item
          label="Tên Playlist"
          name="name"
          required={false}
          rules={[{ required: true, message: "Vui lòng nhập tên playlist" }]}
        >
          <Input placeholder="Nhập tên playlist..." />
        </Form.Item>

        {/* Select nghệ sĩ */}
        <Form.Item label="User" name="user" required={false}>
          <Select
            placeholder="Chọn user cho playlist (không bắt buộc)"
            showSearch
            optionFilterProp="label"
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
          <TextArea rows={3} placeholder="Nhập mô tả cho playlist..." />
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
          <Checkbox />
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

export default CreatePlaylist;
