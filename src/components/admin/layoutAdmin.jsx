import React, { useState } from "react";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import SpotifyIcon from "../ui/spotify-icon";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Đăng xuất", "logout", <PieChartOutlined />),
  getItem("Bài hát", "songs", <PieChartOutlined />, [
    getItem("Danh sách bài hát", "song"),
    getItem("Thêm bài hát", "song/create"),
    getItem("Cập nhật bài hát", "song/update"),
  ]),
  getItem("Nghệ sĩ", "artists", <DesktopOutlined />, [
    getItem("Danh sách nghệ sĩ", "artist"),
    getItem("Thêm nghệ sĩ", "artist/create"),
    getItem("Cập nhật nghệ sĩ", "artist/update"),
  ]),
  getItem("Album/EP", "albums", <DesktopOutlined />, [
    getItem("Danh sách Album/EP", "album"),
    getItem("Thêm Album/EP", "album/create"),
    getItem("Cập nhật Album/EP", "album/update"),
  ]),
  getItem("Danh sách phát", "playlists", <DesktopOutlined />, [
    getItem("Danh sách phát", "playlist"),
    getItem("Thêm danh sách phát", "playlist/create"),
    getItem("Cập nhật danh sách phát", "playlist/update"),
  ]),
  getItem("Quản lí nhạc playlist ", "playlistsongs", <DesktopOutlined />, [
    getItem("Danh nhạc playlist", "playlistsong"),
    getItem("Thêm nhạc playlist", "playlistsongs/create"),
    getItem("Cập nhật nhạc playlist", "playlistsongs/update"),
  ]),
  getItem("Danh sách thể loại", "genres", <DesktopOutlined />, [
    getItem("Danh sách thể loạ", "genre"),
    getItem("Thêm thể loại mới", "playlist/create"),
    getItem("Cập nhật thể loại", "playlist/update"),
  ]),
];

const pageTitles = {
  logout: "Đăng xuất",
  song: "Danh sách Bài hát",
  artist: "Danh sách Nghệ sĩ",
  album: "Danh sách Album",
  playlist: "Danh sách phát",
  playlistsong: "Danh sách nhạc playlist",
};
const MemoizedMenuItem = React.memo(Menu.Item);

const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [openKeys, setOpenKeys] = useState([]);
  const onOpenChange = (keys) => {
    // Nếu user mở nhiều menu thì chỉ giữ cái cuối cùng
    setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
  };
  const location = useLocation(); // <-- Lấy URL hiện tại
  const navigate = useNavigate(); // <-- Để điều hướng khi click menu

  const path = location.pathname.replace("/admin/", "");

  // Giả sử path là /admin/songs => lấy "songs"

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          position: "sticky", // Cố định khi cuộn
          top: 0, // Cố định từ trên cùng
          height: "100vh", // Chiều cao chiếm hết màn hình
          zIndex: 100, // Đảm bảo Sider nằm trên các phần tử khác
        }}
      >
        <div className="logo p-2">
          <SpotifyIcon />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[path]} // path là key hiện tại, ví dụ: "album/create"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={({ key }) => {
            if (key === "logout") {
              localStorage.removeItem("token");
              navigate("/login");
            } else {
              navigate(`/admin/${key}`);
            }
          }}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: "0 24px", background: colorBgContainer }}>
          <h1 className="text-xl font-bold py-4">{pageTitles[path]}</h1>
        </Header>
        <Content style={{ margin: "10px 16px" }}>
          <div
            style={{
              padding: 20,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutAdmin;
