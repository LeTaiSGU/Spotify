import React, { useEffect, useState } from "react";
import { Button, Form, Upload, Input, Select, Checkbox, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const CreatePlaylist = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/users/getall/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("Lỗi tải user:", err);
        message.error("Không thể tải danh sách user");
      });
  }, []);

  const onFinish = async (values) => {
    const formData = new FormData();

    // Tạo dữ liệu JSON cần thiết
    const data = {
      name: values.name,
      user: values.user,
      is_private: values.isPrivate || false,
    };

    formData.append("data", JSON.stringify(data));

    // Đính kèm ảnh bìa nếu có
    if (values.image?.[0]?.originFileObj) {
      formData.append("img_upload", values.image[0].originFileObj);
    }

    // Debug form data
    for (let [key, val] of formData.entries()) {
      console.log(`${key}:`, val);
    }

    try {
      const response = await axios.post("http://localhost:8000/api/playlists/Admin/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      message.success("Tạo playlist thành công!");
      form.resetFields();
    } catch (error) {
      console.error("Tạo playlist thất bại:", error.response?.data || error.message);
      message.error("Tạo playlist thất bại!");
    }
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
        {/* Tên Playlist */}
        <Form.Item
          label="Tên Playlist"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên playlist" }]}
        >
          <Input placeholder="Nhập tên playlist..." />
        </Form.Item>

        {/* Chọn User */}
        <Form.Item
          label="User"
          name="user"
          rules={[{ required: true, message: "Vui lòng chọn user" }]}
        >
          <Select placeholder="Chọn user cho playlist" allowClear>
            {users.map((u) => (
              <Option key={u.id} value={u.id}>
                {u.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Ảnh bìa */}
        <Form.Item
          label="Ảnh bìa"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng chọn ảnh bìa" }]}
        >
          <Upload beforeUpload={() => false} listType="picture">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Checkbox riêng tư */}
        <Form.Item
          label="Riêng tư"
          name="isPrivate"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>

        {/* Submit */}
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
