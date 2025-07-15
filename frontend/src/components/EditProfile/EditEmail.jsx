import React, { useState } from 'react'
import axios from 'axios';
import {toast} from "react-toastify"

const EditEmail = () => {

    const [email, setEmail] = useState(""); 
    
      const handleChange = (e) => {
        setEmail(e.target.value); 
      };
    
      const handleSubmit = async () => {
        try {
          const res = await axios.post(
            `http://localhost:8000/api/v1/user/update-email`,
            { email }, 
            { withCredentials: true }
          );
    
          toast.success(res.data.message || "Email updated successfully", {
            autoClose: 1000,
          });

          setEmail("")
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to update email.", {
            autoClose: 2000,
          });
        }
      };
    

  return (
    <>
      <h6 className="mb-5 text-2xl font-medium">Edit Email</h6>
      <div className="flex items-center space-x-4 max-w-lg">
        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="Enter new email"
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
  )
}

export default EditEmail