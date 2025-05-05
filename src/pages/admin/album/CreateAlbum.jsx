import { useEffect, React } from "react";
import { Button, DatePicker, Form, Upload, Input, Select, message } from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import {
  //đây là để lấy artist đổ vào select
  fetchArtistsSelect,
  //đây là để lấy đường dẫn state
  selectItemsArtist,
} from "../../../redux/slice/artistSlice"; // Giả sử bạn có action này
import { useDispatch, useSelector } from "react-redux";
const { TextArea } = Input;
import { createAlbum } from "../../../redux/slice/albumSlice";

const CreateAlbum = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { content: items = [] } = useSelector(selectItemsArtist); // lấy từ slice

  useEffect(() => {
    dispatch(fetchArtistsSelect());
  }, [dispatch]);

  const artistOptions =
    Array.isArray(items) && items.length > 0
      ? items.map((artist) => ({
          label: artist.name,
          value: artist.artistId,
        }))
      : [];

  const onFinish = (values) => {
    const albumData = {
      title: values.name,
      releaseDate: values.releaseDate.format("YYYY-MM-DD"),
      artistId: values.artist,
      type: values.type,
      image: values.image,
    };

    dispatch(createAlbum(albumData))
      .unwrap()
      .then(() => {
        // Thông báo thành công
        message.success("Thêm album thành công!");
        // Reset form nếu muốn:
        form.resetFields();
      })
      .catch((err) => {
        // Thông báo lỗi
        console.error(err);
        message.error("Thêm album thất bại! Vui lòng thử lại.");
      });
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <>
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
          {/* Input */}
          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            required={false}
          >
            <Input placeholder="Nhập tên..." />
          </Form.Item>

          {/* DatePicker */}
          <Form.Item
            label="Ngày phát hành"
            required={false}
            name="releaseDate"
            rules={[
              { required: true, message: "Vui lòng chọn ngày phát hành" },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Chọn ngày phát hành"
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </Form.Item>

          {/* Upload ảnh */}
          <Form.Item
            label="Ảnh đại diện"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            required={false}
            rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
          >
            <Upload
              listType="picture"
              beforeUpload={() => false}
              accept="image/*"
              maxCount={1}
              multiple={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          {/* Select nghệ sĩ */}
          <Form.Item
            label="Nghệ sĩ"
            name="artist"
            required={false}
            rules={[{ required: true, message: "Vui lòng chọn 1 nghệ sĩ" }]}
          >
            <Select
              placeholder="Tìm và chọn nghệ sĩ"
              showSearch
              optionFilterProp="label"
              options={artistOptions}
              allowClear
            />
          </Form.Item>

          {/* Select thể loại */}
          <Form.Item
            label="Thể loại"
            name="type"
            required={false}
            rules={[{ required: true, message: "Vui lòng chọn thể loại" }]}
          >
            <Select
              placeholder="Chọn thể loại"
              optionFilterProp="label"
              options={[
                { label: "Album", value: "Album" },
                { label: "EP", value: "EP" },
              ]}
              allowClear
            />
          </Form.Item>

          {/* Nút Submit */}
          <Form.Item className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default CreateAlbum;
