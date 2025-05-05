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
import Payment from "./components/payment/Payment";
import PaymentSuccess from "./components/payment/PaymentSuccess";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ContentPlaylist />} />
          <Route path="playlist" element={<PlaylistContent />} />
          <Route path="user" element={<UserProfile />} />
          <Route path="user/more-artists" element={<AllAvatar />} />
          <Route path="user/more-songs" element={<MusicList />} />
          <Route path="user/payment" element={<Payment />} />
          
        </Route>
        <Route path="user/payment/success" element={<PaymentSuccess />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignUpPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
