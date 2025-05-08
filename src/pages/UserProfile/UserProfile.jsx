import LessListSongs from "./LessListSongs";
import AvatarBar from "./AvatarBar";
import MoreListSongs from "./MoreListSongs";
import AllAvatar from "./AllAvatar";
import ProfileHeader from "./ProfileHeader";

function UserProfile() {
  return (
    <div className="w-full h-full custom-scrollbar">
      <ProfileHeader />
      <LessListSongs />
      <AvatarBar />
      {/* <MoreListSongs /> */}
      {/* <AllAvatar /> */}
    </div>
  );
}

export default UserProfile;
