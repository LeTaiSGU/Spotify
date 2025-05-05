import { useEffect, React } from "react";
import {
  Button,
  DatePicker,
  Form,
  Upload,
  Input,
  Select,
  message,
  Image,
} from "antd";
import dayjs from "dayjs";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchArtistsSelect,
  selectItemsArtist,
} from "../../../redux/slice/artistSlice";
import {
  updateAlbum,
  fetchAlbumsSelect,
  fetchAlbumById,
  selectItemsAlbum,
  selectAlbum,
} from "../../../redux/slice/albumSlice";

const { TextArea } = Input;

const UpdateAlbum = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const { content: artist = [] } = useSelector(selectItemsArtist);
  const { content: albums = [] } = useSelector(selectItemsAlbum); // list album để chọn

  useEffect(() => {
    dispatch(fetchArtistsSelect());
    dispatch(fetchAlbumsSelect());
  }, [dispatch]);

  const albumDetail = useSelector(selectAlbum); // chi tiết album

  useEffect(() => {
    if (albumDetail) {
      form.setFieldsValue({
        albumId: albumDetail.albumId,
        title: albumDetail.title,
        releaseDate: dayjs(albumDetail.releaseDate),
        artist: albumDetail.artist?.artistId,
        type: albumDetail.type,
        image: albumDetail.coverImage
          ? [
              {
                uid: "-1", // uid tùy chỉnh, không trùng với bất kỳ file nào mới được upload
                name: "Ảnh hiện tại", // Tên ảnh có thể tùy chỉnh
                status: "done", // Trạng thái ảnh đã tải xong
                url: albumDetail.coverImage, // URL của ảnh từ AWS
                thumbUrl: albumDetail.coverImage, // Thumbnail ảnh (có thể là URL giống URL chính)
              },
            ]
          : [],
      });
    }
  }, [albumDetail, form]);

  const artistOptions = artist.map((artist) => ({
    label: artist.name,
    value: artist.artistId,
  }));

  const albumOptions = albums.map((album) => ({
    label: album.title,
    value: album.albumId,
  }));

  const onSelectAlbum = (value) => {
    dispatch(fetchAlbumById(value)); // lấy chi tiết album
  };

  const onFinish = (values) => {
    const payload = {
      albumId: values.albumId,
      title: values.title,
      releaseDate: values.releaseDate.format("YYYY-MM-DD"),
      artistId: values.artist,
      type: values.type,
      image: values.image || [],
    };

    dispatch(updateAlbum(payload))
      .unwrap()
      .then(() => {
        message.success("Cập nhật album thành công!");
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
        {/* Select tên album (searchable + ảnh) */}
        <Form.Item
          label="Tìm Album"
          name="searchAlbum"
          required={false}
          rules={[{ required: true, message: "Chọn album để cập nhật" }]}
        >
          <Select
            showSearch
            onChange={onSelectAlbum}
            optionFilterProp="label"
            options={albumOptions}
            placeholder="Tìm album"
          />
        </Form.Item>

        {/* albumId không chỉnh sửa */}
        <Form.Item label="Album ID" name="albumId">
          <Input disabled />
        </Form.Item>
        {/* albumId không chỉnh sửa */}
        <Form.Item
          label="Tên Album"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          required={false}
        >
          <Input />
        </Form.Item>
        {/* Ngày phát hành */}
        <Form.Item
          label="Ngày phát hành"
          name="releaseDate"
          required={false}
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

        {/* Ảnh */}
        <Form.Item
          label="Ảnh đại diện"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Vui lòng chọn ảnh" }]}
          required={false}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            accept="image/*"
            maxCount={1}
            multiple={false}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
        </Form.Item>

        {/* Nghệ sĩ */}
        <Form.Item
          label="Nghệ sĩ"
          name="artist"
          rules={[{ required: true, message: "Chọn nghệ sĩ" }]}
          required={false}
        >
          <Select
            placeholder="Chọn nghệ sĩ"
            showSearch
            optionFilterProp="label"
            options={artistOptions}
            allowClear
          />
        </Form.Item>

        {/* Thể loại */}
        <Form.Item
          label="Thể loại"
          name="type"
          required={false}
          rules={[{ required: true, message: "Chọn thể loại" }]}
        >
          <Select
            placeholder="Chọn thể loại"
            options={[
              { label: "Album", value: "ALBUM" },
              { label: "EP", value: "EP" },
            ]}
            allowClear
          />
        </Form.Item>

        {/* Submit */}
        <Form.Item className="flex justify-end">
          <Button type="primary" htmlType="submit">
            Cập nhật album
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UpdateAlbum;
