import { React, useEffect, useState } from "react";
import { Checkbox, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const UpdatePlaylist = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistDetail, setPlaylistDetail] = useState(null);

  useEffect(() => {
    // Fetch all users to populate the user combobox
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users/getall/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        message.error("Không thể tải danh sách user");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch playlists when a user is selected
    const fetchPlaylists = async (userId) => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:8000/api/playlists/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setPlaylists(response.data);
        } catch (error) {
          console.error("Error fetching playlists:", error);
          message.error("Không thể tải danh sách playlist");
        }
      }
    };

    // If a user is selected, fetch playlists for that user
    if (form.getFieldValue("user")) {
      fetchPlaylists(form.getFieldValue("user"));
    } else {
      setPlaylists([]); // Clear playlists if no user is selected
    }
  }, [form.getFieldValue("user")]);

  const userOptions = users.map((user) => ({
    label: user.name,
    value: user.id,
  }));

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
        `http://localhost:8000/api/playlists/update/${values.playlistId}/`,
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
        {/* Combobox chọn user */}
        <Form.Item
          label="Chọn User"
          name="user"
          rules={[{ required: true, message: "Chọn user để cập nhật playlist" }]}
        >
          <Select
            showSearch
            options={userOptions}
            placeholder="Chọn user"
            optionFilterProp="label"
            onChange={(value) => {
              // Fetch playlists when a user is selected
              form.setFieldsValue({ playlistId: undefined });
              setPlaylistDetail(null); // Reset playlist details
              setPlaylists([]); // Clear playlists
              if (value) {
                axios
                  .get(`http://localhost:8000/api/playlists/user/${value}`, {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                  })
                  .then((res) => {
                    setPlaylists(res.data);
                  })
                  .catch((err) => {
                    console.error("Error fetching playlists:", err);
                    message.error("Không thể tải danh sách playlist");
                  });
              }
            }}
          />
        </Form.Item>

        {/* Combobox chọn playlist */}
        <Form.Item
          label="Chọn Playlist"
          name="playlistId"
          rules={[{ required: true, message: "Chọn playlist để cập nhật" }]}
        >
          <Select
            showSearch
            options={playlistsOptions}
            placeholder="Chọn playlist"
            optionFilterProp="label"
            onChange={(value) => {
              const selected = playlists.find((p) => p.id === value);
              if (selected) {
                form.setFieldsValue({
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
            onChange={({ fileList }) => form.setFieldsValue({ image: fileList })}
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
