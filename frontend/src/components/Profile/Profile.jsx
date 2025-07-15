import Sidebar from "../Sidebar/Sidebar.jsx";
import ProfileCard from "./ProfileCard.jsx";

const Profile = () => {
  return (
    <>
      {/* Fixed Sidebar */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-md z-10">
        <Sidebar />
      </aside>

      {/* Main content with left margin so it doesn't hide behind sidebar */}
      <main className="ml-64 p-8 bg-gray-50 min-h-screen flex justify-center items-start">
        <ProfileCard />
      </main>
    </>
  );
};

export default Profile;
