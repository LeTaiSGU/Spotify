import React from "react";
import { Button, Form, Upload, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_ROOT } from "~/utils/constants";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CreateArtist = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (values.image?.[0]?.originFileObj) {
      formData.append("img_upload", values.image[0].originFileObj);
    }

    // Debug FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        `${API_ROOT}/api/artists/create/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Tạo nghệ sĩ thành công:", response.data);

      // Hiển thị thông báo thành công
      message.success("Tạo nghệ sĩ thành công!");

      // Đặt lại form
      form.resetFields();
    } catch (error) {
      console.error(
        "Tạo nghệ sĩ thất bại:",
        error.response?.data || error.message
      );

      // Hiển thị thông báo lỗi chi tiết
      if (error.response?.data?.detail) {
        message.error(`Tạo nghệ sĩ thất bại: ${error.response.data.detail}`);
      } else if (error.response?.data?.message) {
        message.error(`Tạo nghệ sĩ thất bại: ${error.response.data.message}`);
      } else {
        message.error("Tạo nghệ sĩ thất bại! Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
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
        {/* Tên nghệ sĩ */}
        <Form.Item
          label="Tên nghệ sĩ"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ" }]}
        >
          <Input placeholder="Nhập tên nghệ sĩ..." />
        </Form.Item>

        {/* Mô tả */}
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả..." />
        </Form.Item>

        {/* Upload ảnh */}
        <Form.Item
          label="Ảnh đại diện"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng chọn ảnh đại diện" }]}
        >
          <Upload
            name="image"
            listType="picture"
            beforeUpload={() => false}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {/* Submit */}
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? "Đang xử lý..." : "Lưu thông tin"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateArtist;
