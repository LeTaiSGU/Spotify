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
  clearSelectedAlbum,
} from "../../../redux/slice/albumSlice";

const { TextArea } = Input;

const UpdateAlbum = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  // Điều chỉnh để phù hợp với cấu trúc dữ liệu từ API Django
  const artists = useSelector(selectItemsArtist);
  const albums = useSelector(selectItemsAlbum);

  // Điều chỉnh để sử dụng đúng định dạng response
  const artistList = Array.isArray(artists) ? artists : artists?.content || [];
  const albumList = Array.isArray(albums) ? albums : albums?.content || [];

  useEffect(() => {
    // Reset form khi component được mount
    form.resetFields();
    dispatch(fetchArtistsSelect());
    dispatch(fetchAlbumsSelect());

    // Cleanup khi component unmount
    return () => {
      dispatch(clearSelectedAlbum());
      form.resetFields();
    };
  }, [dispatch, form]);

  const albumDetail = useSelector(selectAlbum);

  useEffect(() => {
    if (albumDetail) {
      form.setFieldsValue({
        id: albumDetail.id,
        title: albumDetail.title,
        releaseDate: albumDetail.release_date
          ? dayjs(albumDetail.release_date)
          : null,
        artist: albumDetail.artist?.id,
        description: albumDetail.description || "", // Thêm description
        image: albumDetail.avatar // Sử dụng avatar thay vì cover_image
          ? [
              {
                uid: "-1",
                name: "Ảnh hiện tại",
                status: "done",
                url: albumDetail.avatar,
                thumbUrl: albumDetail.avatar,
              },
            ]
          : [],
      });
    } else {
      form.resetFields();
    }
  }, [albumDetail, form]);

  const artistOptions = artistList.map((artist) => ({
    label: artist.name,
    value: artist.id,
  }));

  const albumOptions = albumList.map((album) => ({
    label: album.title,
    value: album.id,
  }));

  const onSelectAlbum = (value) => {
    dispatch(fetchAlbumById(value));
  };

  const onFinish = (values) => {
    const payload = {
      id: values.id,
      title: values.title,
      releaseDate: values.releaseDate.format("YYYY-MM-DD"),
      description: values.description || "",
      artistId: values.artist,
      type: values.type,
      image: values.image || [],
    };

    dispatch(updateAlbum(payload))
      .unwrap()
      .then(() => {
        message.success("Cập nhật album thành công!");
        form.resetFields();
        dispatch(clearSelectedAlbum());
      })
      .catch((err) => {
        console.error(err);
        message.error(
          "Cập nhật thất bại! " + (err.message || "Vui lòng thử lại.")
        );
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
        <Form.Item label="Album ID" name="id">
          <Input disabled />
        </Form.Item>

        {/* Tên album */}
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

        {/* Mô tả */}
        <Form.Item label="Mô tả" name="description" required={false}>
          <TextArea rows={4} placeholder="Nhập mô tả album..." />
        </Form.Item>
        {/* Thể loại
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
        </Form.Item> */}

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
