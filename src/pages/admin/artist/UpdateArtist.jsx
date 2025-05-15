import React, { useEffect, useState } from "react";
import { Button, Form, Upload, Input, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { TextArea } = Input;

const UpdateArtist = () => {
  const [form] = Form.useForm();
  const [artistList, setArtistList] = useState([]);
  const [artistDetail, setArtistDetail] = useState(null);

  useEffect(() => {
    form.resetFields();
    fetchArtistOptions();

    return () => {
      setArtistDetail(null);
      form.resetFields();
    };
  }, [form]);

  useEffect(() => {
    if (artistDetail) {
      form.setFieldsValue({
        id: artistDetail.id,
        name: artistDetail.name,
        description: artistDetail.description,
        image: artistDetail.avatar
          ? [
              {
                uid: "-1",
                name: "Ảnh hiện tại",
                status: "done",
                url: artistDetail.avatar,
                thumbUrl: artistDetail.avatar,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [artistDetail, form]);

  const fetchArtistOptions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/artists/");
      setArtistList(
        Array.isArray(res.data) ? res.data : res.data.content || []
      );
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách nghệ sĩ");
    }
  };

  const onSelectArtist = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/artists/${id}/`);
      setArtistDetail(res.data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải thông tin nghệ sĩ");
    }
  };

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);

    if (
      values.image &&
      values.image.length > 0 &&
      values.image[0].originFileObj
    ) {
      formData.append("avatar", values.image[0].originFileObj);
    }

    try {
      await axios.patch(
        `http://localhost:8000/api/artists/${values.id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Cập nhật nghệ sĩ thành công!");
      form.resetFields();
      setArtistDetail(null);
      fetchArtistOptions();
    } catch (err) {
      console.error(err);
      message.error(
        "Cập nhật thất bại: " + (err.message || "Vui lòng thử lại")
      );
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };

  const artistOptions = artistList.map((artist) => ({
    label: artist.name,
    value: artist.id,
  }));

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
          label="Chọn nghệ sĩ"
          name="searchArtist"
          rules={[{ required: true, message: "Chọn nghệ sĩ để cập nhật" }]}
        >
          <Select
            showSearch
            onChange={onSelectArtist}
            optionFilterProp="label"
            options={artistOptions}
            placeholder="Tìm nghệ sĩ"
          />
        </Form.Item>

        <Form.Item label="Artist ID" name="id">
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Chọn ảnh" }]}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            accept="image/*"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
        </Form.Item>

        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Cập nhật nghệ sĩ
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateArtist;
