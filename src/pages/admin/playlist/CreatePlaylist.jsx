import React, { useEffect, useState } from "react";
import { Checkbox, Form, Input, Select, Upload, Button, message } from "antd";
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
        console.error("Error fetching users:", err);
        message.error("Không thể tải danh sách user");
      });
  }, []);

  const userOptions = users.map((u) => (
    <Option key={u.id} value={u.id}>
      {u.name}
    </Option>
  ));
  const onFinish = async (values) => {
    const formData = new FormData();
  
    const data = {
      name: values.name,
      description: values.description, // đúng tên field trong model
    };
  
    formData.append("data", JSON.stringify(data));
  
    if (values.image?.[0]?.originFileObj) {
      formData.append("img_upload", values.image[0].originFileObj);
    }
  
    try {
      const response = await axios.post("http://localhost:8000/api/artists/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log("Tạo thành công:", response.data);
    } catch (error) {
      console.error("Tạo nghệ sĩ thất bại:", error.response?.data || error.message);
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
        {/* Tên playlist */}
        <Form.Item
          label="Tên Playlist"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên playlist" }]}
        >
          <Input placeholder="Nhập tên playlist..." />
        </Form.Item>

        {/* Select user */}
        <Form.Item label="User" name="user">
          <Select
            placeholder="Chọn user cho playlist"
            showSearch
            optionFilterProp="label"
            allowClear
          >
            {userOptions}
          </Select>
        </Form.Item>

        {/* Ảnh bìa */}
        <Form.Item
          label="Ảnh bìa"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
          rules={[{ required: true, message: "Vui lòng chọn ảnh bìa" }]}
        >
          <Upload beforeUpload={() => false} listType="picture">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>


        {/* Checkbox */}
        <Form.Item
          name="isPrivate"
          label="Riêng tư"
          valuePropName="checked"
          initialValue={false}
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
