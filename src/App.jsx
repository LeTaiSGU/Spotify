import React, { useState } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Layout from "./components/layout/layout";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import UserProfile from "./pages/UserProfile/UserProfile";
import PlaylistContent from "~/components/playlist/playlistcontent";
import ContentPlaylist from "~/components/listContent/contentPlaylist";
import NotFound from "./pages/404/404";
import AllAvatar from "./pages/UserProfile/AllAvatar";
import MusicList from "./pages/UserProfile/MoreListSongs";
import AdminLayout from "./components/admin/layoutAdmin";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./redux/slice/authSlice";
import { useEffect } from "react";

import Payment from "./components/payment/Payment";
import PaymentSuccess from "./components/payment/PaymentSuccess";

import AdminLayout from "./components/admin/layoutAdmin";
import ArtistProfile from "./pages/artist/ArtistProfile";
import Dashboard from "./pages/admin/Dashboard";
import Song from "./pages/admin/song/Song";
import Album from "./pages/admin/album/Album";
import Artist from "./pages/admin/artist/Artist";
import Playlist from "./pages/admin/playlist/Playlist";
import CreateSong from "./pages/admin/song/CreateSong";
import UpdateSong from "./pages/admin/song/UpdateSong";
import CreateAlbum from "./pages/admin/album/CreateAlbum";
import UpdateAlbum from "./pages/admin/album/UpdateAlbum";
import CreateArtist from "./pages/admin/artist/CreateArtist";
import UpdateArtist from "./pages/admin/artist/UpdateArtist";
import CreatePlaylist from "./pages/admin/playlist/CreatePlaylist";
import UpdatePlaylist from "./pages/admin/playlist/UpdatePlaylist";
import Payment from "./components/payment/Payment";
import "~/utils/axiosWithAutoRefesh";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const [isChecking, setIsChecking] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null || user === undefined) {
      dispatch(fetchCurrentUser()).finally(() => {
        setIsChecking(false);
      });
    } else {
      setIsChecking(false);
    }
  }, [user, dispatch]);

  if (isChecking) {
    // Hiển thị loading trong khi kiểm tra
    return <div>Đang kiểm tra đăng nhập...</div>;
  }

  if (user === null || user === undefined) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Thêm component mới để bảo vệ route Admin
const ProtectedAdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user === null || user === undefined) {
      dispatch(fetchCurrentUser());
    }
  }, [user, dispatch]);

  // Kiểm tra user tồn tại và có quyền admin
  if (user === null || user === undefined) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền admin
  if (!user.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ContentPlaylist />} />

          <Route
            path="playlist/:id"
            element={
              <PrivateRoute>
                <PlaylistContent type="playlist" />
              </PrivateRoute>
            }
          />
          <Route path="album/:id" element={<PlaylistContent type="album" />} />
          <Route path="song/:id" element={<PlaylistContent type="song" />} />

          {/* <PlaylistContent type="song" />
          <PlaylistContent type="album" /> */}
          <Route
            path="user"
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route path="user/more-artists" element={<AllAvatar />} />
          <Route path="user/more-songs" element={<MusicList />} />
          <Route path="user/payment" element={<Payment />} />

          <Route path="search" element={<SearchResults />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
        </Route>

        <Route path="user/payment/success" element={<PaymentSuccess />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="song" element={<Song />} />
          <Route path="song/create" element={<CreateSong />} />
          <Route path="song/update" element={<UpdateSong />} />
          <Route path="artist" element={<Artist />} />
          <Route path="artist/create" element={<CreateArtist />} />
          <Route path="artist/update" element={<UpdateArtist />} />
          <Route path="album" element={<Album />} />
          <Route path="album/create" element={<CreateAlbum />} />
          <Route path="album/update" element={<UpdateAlbum />} />
          <Route path="playlist" element={<Playlist />} />
          <Route path="playlist/create" element={<CreatePlaylist />} />
          <Route path="playlist/update" element={<UpdatePlaylist />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
