import axios from "axios";
import { useEffect, useState } from "react";

const ProfileCard = () => {

    const [user, setUser] = useState()

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/user/getuserdetails`,
          {
            withCredentials: true,
          }
        );
        // console.log("User details : ", res.data);
        setUser(res.data.user)

        // try part end
      } catch (error) {
        console.log("Error fetching user details : ", error);
      }
    };
    getUserDetails();
  }, []);

  return (
    <div className="flex justify-center my-12">
      <div className="w-full max-w-2xl bg-white border-2 rounded-lg p-6 shadow-lg">
        {/* Profile Heading */}
        <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>

        {/* Avatar Image Centered */}
        <div className="flex justify-center mb-6">
          <img
            src={user?.avatar} // Replace with actual avatar URL
            alt="user photo"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* User Details */}
        <div className="space-y-3 text-lg w-xl">
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">Full Name:</p> <span>{user?.fullName || "Na"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">User Name:</p> <span>{user?.userName || "Na"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">Email:</p> <span>{user?.email || "Na"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">Phone Number:</p>{" "}
            <span>{user?.phoneNumber || "Na"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">State:</p> <span>{user?.address?.state || "Na"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">City:</p> <span>{user?.address?.city || "Na"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">Street:</p> <span>{user?.address?.street || "Na"}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <p className="font-semibold">Pin Code:</p> <span>{user?.address?.pincode || "Na"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
