import { useEffect, React } from "react";
import { Button, DatePicker, Form, Upload, Input, Select, message } from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import {
  fetchArtistsSelect,
  selectItemsArtist,
} from "../../../redux/slice/artistSlice";
import { useDispatch, useSelector } from "react-redux";
import { createAlbum } from "../../../redux/slice/albumSlice";

const { TextArea } = Input;

const CreateAlbum = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Điều chỉnh để phù hợp với cấu trúc dữ liệu từ API Django
  const artists = useSelector(selectItemsArtist);
  // Điều chỉnh để sử dụng đúng định dạng response
  const artistList = Array.isArray(artists) ? artists : artists?.content || [];

  useEffect(() => {
    dispatch(fetchArtistsSelect());
  }, [dispatch]);

  const artistOptions = artistList.map((artist) => ({
    label: artist.name,
    value: artist.id,
  }));

  const onFinish = (values) => {
    // Kiểm tra xem values.artist có tồn tại không
    if (!values.artist) {
      message.error("Vui lòng chọn một nghệ sĩ!");
      return;
    }

    const albumData = {
      title: values.name,
      releaseDate: values.releaseDate.format("YYYY-MM-DD"),
      artistId: values.artist, // Đảm bảo không null
      description: values.description || "",
      type: values.type,
      image: values.image,
    };

    console.log("Album data to be sent:", albumData); // Log để kiểm tra

    dispatch(createAlbum(albumData))
      .unwrap()
      .then(() => {
        message.success("Thêm album thành công!");
        form.resetFields();
      })
      .catch((err) => {
        console.error(err);
        message.error(
          "Thêm album thất bại! " + (err.message || "Vui lòng thử lại.")
        );
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
          rules={[{ required: true, message: "Vui lòng chọn ngày phát hành" }]}
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

        {/* Select thể loại
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
              { label: "Album", value: "ALBUM" },
              { label: "EP", value: "EP" },
            ]}
            allowClear
          />
        </Form.Item> */}

        {/* Mô tả */}
        <Form.Item label="Mô tả" name="description" required={false}>
          <TextArea rows={4} placeholder="Nhập mô tả..." />
        </Form.Item>

        {/* Nút Submit */}
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Lưu thông tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateAlbum;
