import { React } from "react";
import { Button, Form, Upload, Input, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { createArtist } from "../../../redux/slice/artistSlice"; // <-- import đúng action

const { TextArea } = Input;

const CreateArtist = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    const artistData = {
      name: values.name,
      description: values.description,
      image: values.image,
    };

    dispatch(createArtist(artistData))
      .unwrap()
      .then(() => {
        message.success("Thêm nghệ sĩ thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error(err);
        message.error("Thêm nghệ sĩ thất bại! Vui lòng thử lại.");
      });
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
          required={false}
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ" }]}
        >
          <Input placeholder="Nhập tên nghệ sĩ..." />
        </Form.Item>

        {/* Mô tả */}
        <Form.Item
          label="Mô tả"
          required={false}
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả..." />
        </Form.Item>

        {/* Upload ảnh */}
        <Form.Item
          label="Ảnh đại diện"
          required={false}
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
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateArtist;
