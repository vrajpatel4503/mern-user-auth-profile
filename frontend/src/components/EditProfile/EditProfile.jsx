import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import EditUserName from "./EditUserName";
import EditEmail from "./EditEmail";
import EditAvatar from "./EditAvatar";

const EditProfile = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold ml-28 mb-14">Edit Profile</h1>
        <div className="ml-28">
          <EditUserName />
        </div>
        <div className="ml-28 mt-10 ">
          <EditEmail />
        </div>
        <div className="ml-28 mt-10 ">
          <EditAvatar />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
