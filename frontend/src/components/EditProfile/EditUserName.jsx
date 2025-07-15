import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const EditUserName = () => {
  const [userName, setUserName] = useState(""); 

  const handleChange = (e) => {
    setUserName(e.target.value); 
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update-username`,
        { userName }, 
        { withCredentials: true }
      );

      toast.success(res.data.message || "Username updated successfully", {
        autoClose: 1000,
      });

      setUserName("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update username.", {
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <h6 className="mb-5 text-2xl font-medium">Update username</h6>
      <div className="flex items-center space-x-4 max-w-lg">
        <input
          type="text"
          value={userName}
          onChange={handleChange} 
          placeholder="Enter new username"
          className="border border-gray-300 rounded px-4 py-3 text-lg w-full"
        />
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Change
        </button>
      </div>
    </>
  );
};

export default EditUserName;
