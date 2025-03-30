import { MagnifyingGlassIcon, BellIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

const SpotifyHeader = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-black text-white">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg"
          alt="Spotify Logo"
          className="h-6"
        />
        <button className="bg-gray-800 p-2 rounded-full">
          <img src="https://img.icons8.com/ios-filled/50/ffffff/home.png" alt="Home" className="h-5 w-5" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-800 px-4 py-2 rounded-full w-1/3">
        <MagnifyingGlassIcon className="text-gray-400 h-5 w-5 mr-2" />
        <input
          type="text"
          placeholder="What do you want to play?"
          className="bg-transparent outline-none text-white w-full"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold">
          Explore Premium
        </button>
        <ArrowDownTrayIcon className="h-6 w-6 text-white cursor-pointer" />
        <button className="relative">
          <BellIcon className="h-6 w-6 text-white" />
          <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
        </button>
        <div className="bg-orange-500 h-8 w-8 flex items-center justify-center rounded-full text-black font-semibold">
          M
        </div>
      </div>
    </header>
  );
}

export default SpotifyHeader;
