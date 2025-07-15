import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditAvatar = () => {
  const [formData, setFormData] = useState({
    avatar: null,
  });

  // handle file change
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  // handle submit
  const handleSubmit = async () => {
    try {
      const formDataToSubmit = new FormData(); 

      if (formData.avatar) {
        formDataToSubmit.append("avatar", formData.avatar);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update-avatar`,
        formDataToSubmit, 
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      toast.success(res.data.message || "Avatar updated successfully", {
        autoClose: 1000,
      });

      // Optional: reset file input
      setFormData({ avatar: null });

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update avatar", {
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <h6 className="mb-5 text-2xl font-medium">Update Avatar</h6>
      <div className="flex items-center space-x-4 max-w-lg">
        <input
          type="file"
          name="avatar"
          onChange={handleFileChange}
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

export default EditAvatar;


// FormData is a built-in JavaScript object that allows you to construct key/value pairs for form fields and files, which can then be sent using fetch or axios in a multipart/form-data request — especially useful for file uploads (like images).