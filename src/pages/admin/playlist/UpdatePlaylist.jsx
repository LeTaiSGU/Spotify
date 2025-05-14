import { React, useEffect, useState } from "react";
import { Checkbox, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";

const { TextArea } = Input;

const UpdatePlaylist = () => {
  const [form] = Form.useForm();
  const [playlists, setPlaylists] = useState([]);
  const [playlistDetail, setPlaylistDetail] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(`${API_ROOT}/api/playlists/getall/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPlaylists(response.data);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        message.error("Không thể tải danh sách playlist");
      }
    };
    fetchPlaylists();
  }, []);

  const playlistsOptions = playlists.map((playlist) => ({
    label: playlist.name,
    value: playlist.id,
  }));

  const onFinish = async (values) => {
    const formData = new FormData();

    // JSON phần dữ liệu text
    const data = {
      name: values.name,
      is_private: values.isPrivate,
    };

    formData.append("data", JSON.stringify(data));

    // Nếu người dùng upload ảnh mới thì thêm vào FormData
    if (values.image?.[0]?.originFileObj) {
      formData.append("img_upload", values.image[0].originFileObj);
    }

    try {
      await axios.patch(
        `${API_ROOT}/api/playlists/update/${values.playlistId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      message.success("Cập nhật thành công");
    } catch (error) {
      console.error("Lỗi cập nhật:", error.response?.data || error.message);
      message.error("Cập nhật thất bại");
    }
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
        {/* Combobox chọn playlist */}
        <Form.Item
          label="Tìm playlist"
          name="searchPlaylist"
          rules={[{ required: true, message: "Chọn playlist để cập nhật" }]}
        >
          <Select
            showSearch
            options={playlistsOptions}
            placeholder="Tìm playlist"
            optionFilterProp="label"
            onChange={(value) => {
              const selected = playlists.find((p) => p.id === value);
              if (selected) {
                form.setFieldsValue({
                  playlistId: selected.id,
                  name: selected.name,
                  isPrivate: selected.is_private,
                });
                setPlaylistDetail(selected);
              }
            }}
          />
        </Form.Item>

        {/* Hiển thị ID playlist */}
        <Form.Item label="ID playlist" name="playlistId">
          <Input placeholder="ID" disabled />
        </Form.Item>

        {/* Tên playlist */}
        <Form.Item
          label="Tên Playlist"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên playlist" }]}
        >
          <Input placeholder="Nhập tên playlist..." />
        </Form.Item>

        {/* Upload ảnh */}
        <Form.Item
          label="Ảnh"
          name="image"
          valuePropName="fileList"
          rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
        >
          <Upload
            listType="picture"
            accept="image/*"
            beforeUpload={() => false}
            maxCount={1}
            disabled={!playlistDetail}
            multiple={false}
            onChange={({ fileList }) =>
              form.setFieldsValue({ image: fileList })
            } // Fix fileList
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Private checkbox */}
        <Form.Item
          name="isPrivate"
          label="Private"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox disabled={!playlistDetail} />
        </Form.Item>

        {/* Submit */}
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Cập nhật Playlist
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdatePlaylist;
