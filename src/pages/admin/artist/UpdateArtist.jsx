import { useEffect, React } from "react";
import { Button, Form, Upload, Input, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArtistsSelect,
  selectItemsArtist,
  fetchArtistById,
  updateArtist,
  selectArtist,
} from "../../../redux/slice/artistSlice"; // giả sử bạn đã có các action này

const { TextArea } = Input;

const UpdateArtist = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { content: artistList = [] } = useSelector(selectItemsArtist);
  const artistDetail = useSelector(selectArtist);

  useEffect(() => {
    dispatch(fetchArtistsSelect());
  }, [dispatch]);

  useEffect(() => {
    if (artistDetail) {
      form.setFieldsValue({
        artistId: artistDetail.artistId,
        name: artistDetail.name,
        description: artistDetail.description,
        image: artistDetail.image
          ? [
              {
                uid: "-1",
                name: "Ảnh hiện tại",
                status: "done",
                url: artistDetail.image,
                thumbUrl: artistDetail.image,
              },
            ]
          : [],
      });
    }
  }, [artistDetail, form]);

  const artistOptions = artistList.map((artist) => ({
    label: artist.name,
    value: artist.artistId,
  }));

  const onSelectArtist = (value) => {
    dispatch(fetchArtistById(value));
  };

  const onFinish = (values) => {
    const payload = {
      artistId: values.artistId,
      name: values.name,
      description: values.description,
      image: values.image || [],
    };

    dispatch(updateArtist(payload))
      .unwrap()
      .then(() => {
        message.success("Cập nhật nghệ sĩ thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error(err);
        message.error("Cập nhật thất bại!");
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
        {/* Select nghệ sĩ */}
        <Form.Item
          label="Chọn nghệ sĩ"
          name="searchArtist"
          required={false}
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

        {/* ID nghệ sĩ */}
        <Form.Item label="Artist ID" name="artistId">
          <Input disabled />
        </Form.Item>

        {/* Tên nghệ sĩ */}
        <Form.Item
          label="Tên"
          required={false}
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên nghệ sĩ" }]}
        >
          <Input />
        </Form.Item>

        {/* Mô tả */}
        <Form.Item
          label="Mô tả"
          required={false}
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        {/* Ảnh đại diện */}
        <Form.Item
          label="Ảnh"
          required={false}
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

        {/* Submit */}
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
