import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ContentPlaylist />} />
          <Route
            path="playlist/:playlistId"
            element={<PlaylistContent type="playlist" />}
          />
          <Route
            path="album/:albumId"
            element={<PlaylistContent type="album" />}
          />
          <Route
            path="song/:songId"
            element={<PlaylistContent type="song" />}
          />

          {/* <PlaylistContent type="song" />
          <PlaylistContent type="album" /> */}
          <Route path="user" element={<UserProfile />} />
          <Route path="user/more-artists" element={<AllAvatar />} />
          <Route path="user/more-songs" element={<MusicList />} />
          <Route path="user/payment" element={<Payment />} />
        </Route>

        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />

        <Route
          path="/admin"
          element={
            // <ProtectedAdminRoute>
            <AdminLayout />
            // </ProtectedAdminRoute>
          }
        >
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
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
          {/* <Route path="users" element={<Users />} /> */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
