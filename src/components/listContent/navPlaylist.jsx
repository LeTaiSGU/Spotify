import { useState} from "react";
import { useSidebar } from "../../hooks/useSidebar";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { FaPlus } from "react-icons/fa";

 const NavPlaylist = () => {

  // const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { isExplored, setIsExplored } = useSidebar();

  const handleClickExplore = () => setIsExplored((prev) => !prev);

  const handleClickSearch = () => { 
    if(!expanded){
        setExpanded(true);
    }else{
        setExpanded(false);
    }
    
    };
  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   navigate(`/playlist?search=${search}`);
  // };

  return (
    
    <div className={`bg-black text-white p-4 rounded-lg shadow-lg transition-all duration-300 ${isExplored ? "w-full" : "w-16"}`}>

      {/* Header */}
             <div className="flex items-center mb-4">
         <h2 className="text-lg font-semibold flex items-center gap-2">
           <span className="text-xl">❚❚</span> 
           {isExplored && "Your Library"}
         </h2>
         <div className="flex items-center gap-1 ml-auto">
          {isExplored && (  
            
           <button className="bg-gray-900 px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold hover:bg-gray-700">
             <FaPlus className="text-white" /> Create
           </button>) }
          
           <IoIosArrowForward 
            onClick={handleClickExplore} 
            className={`text-gray-400 text-xl cursor-pointer hover:text-white transition-transform duration-300 ${isExplored ? "rotate-90" : ""}`}
            />

         </div>
        </div>


      {/* Playlist Filter */}
      {isExplored && (
        <button className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-semibold mb-3">
        Playlists
      </button>) 
      }
      

      {/* Search & Sorting */}
        <div className="flex items-center justify-between mb-4">
              <form onSubmit={(e) => e.preventDefault()} className="relative flex-1">
                       {/* Icon search */}
                       <button
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleClickSearch()}
                      >
                        <FiSearch className="text-2xl" />
                      </button>

                      {/* Input Tìm kiếm */}
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search..."
                        className={`absolute bg-gray-800 text-white py-2 rounded-md focus:outline-none transition-all duration-300 ${
                          expanded ? "w-48 px-4 opacity-100 left-10" : "w-0 px-0 opacity-0"
                        }`}
                        onBlur={() => setExpanded(false)} // Mất focus thì input thu nhỏ lại
                      />
            </form>
        {isExplored && (
            <div className="relative inline-block">
            <div className={"flex justify-between items-center gap-2"}>
            <h3>Recents</h3>
            {/* Button Sort */}
            <button
                className="text-gray-400 hover:text-white p-2"
                onClick ={() => setIsOpen(!isOpen)}
                >
                ☰
            </button>
    
            </div>
            
          {/* Dropdown */}
          {isOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-gray-900 text-white shadow-lg rounded-md overflow-hidden"
              onBlur={() => setIsOpen(false)} // Mất focus thì ẩn
              tabIndex={0}
            >
              <div className="px-4 py-2 text-gray-400">Sort by</div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">
                Recents ✅
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">
                Recently Added
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">
                Alphabetical
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">
                Creator
              </button>
              <hr className="border-gray-700" />
              <div className="px-4 py-2 text-gray-400">View as</div>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">
                Compact
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">
                List ✅
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-700">
                Grid
              </button>
            </div>
          )}    
          </div>
       
        )}
      </div>

      {/* Playlist Item */}
      <div className={`bg-gray-900 p-3 rounded-md flex items-center gap-3 cursor-pointer hover:bg-gray-800 ${isExplored ? "" : "w-4 h-4"}`}>
        <img
          src="https://source.unsplash.com/50x50/?music"
          alt="Playlist Cover"
          className="w-12 h-12 rounded-md"
        />
        {isExplored && (
          <div>
          <h3 className="text-white font-semibold">Yêu thích 1</h3>
          <p className="text-gray-400 text-sm">Playlist • Minh Triết Tô</p>
        </div>
        )}
        
      </div>
    </div>
    
  );
};


export default NavPlaylist;
