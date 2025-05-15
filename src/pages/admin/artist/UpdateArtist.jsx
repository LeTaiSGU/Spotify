import React, { useEffect } from "react";
import { Button, Form, Upload, Input, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  updateArtist,
  fetchArtistsSelect,
  fetchArtistById,
  selectItemsArtist,
  selectArtist,
  clearSelectedArtist,
} from "../../../redux/slice/artistSlice";

const { TextArea } = Input;

const UpdateArtist = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const artists = useSelector(selectItemsArtist);
  const artistDetail = useSelector(selectArtist);

  useEffect(() => {
    form.resetFields();
    dispatch(fetchArtistsSelect());

    return () => {
      dispatch(clearSelectedArtist());
      form.resetFields();
    };
  }, [dispatch, form]);

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

  const onSelectArtist = (id) => {
    dispatch(fetchArtistById(id));
  };

  const onFinish = async (values) => {
    try {
      await dispatch(
        updateArtist({
          id: values.id,
          name: values.name,
          description: values.description,
          image: values.image,
        })
      ).unwrap();

      message.success("Cập nhật nghệ sĩ thành công!");
      form.resetFields();
      dispatch(clearSelectedArtist());
      dispatch(fetchArtistsSelect());
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

  const artistOptions = artists.map((artist) => ({
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
