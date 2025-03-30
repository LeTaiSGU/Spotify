import NavPlaylist from "../../components/listContent/navPlaylist";
import SpotifyHeader from "../../components/listContent/headerTam";
import HeaderPlaylist from "../../components/listContent/sidebarPlaylist";
import ContentPlaylist from "../../components/listContent/contentPlaylist";

import { SidebarProvider, useSidebar } from "../../hooks/useSidebar";


const Layout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full px-2">
        <SpotifyHeader />
        <div className="flex gap-2">
          <SidebarContent />
        </div>
      </div>
    </SidebarProvider>
  );
};

const SidebarContent = () => {
  const { isExplored, setIsExplored } = useSidebar(); // Đảm bảo được gọi bên trong SidebarProvider

  return (
    <>
      <div className={`flex flex-none top-0 ${isExplored ? "w-105" : "w-16"}`}><NavPlaylist /></div>
      <div className="flex flex-col w-full">
      <div className="flex-grow text-white text-xl font-semibold"><HeaderPlaylist /></div>
      <div className="flex-grow text-white text-xl font-semibold"><ContentPlaylist /></div>
      </div>
      
    </>
  );
};

export default Layout;
