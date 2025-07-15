import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/authSlice.js";
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handle user login details
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // handle user login submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );

      // console.log(res.data.user)
      dispatch(authActions.login());

      toast.success(res.data.message || "Login successfull", {
        autoClose: 1000,
      });

      setTimeout(() => {
        navigate("/profile");
      }, 2000);

      // try part end
    } catch (error) {
      console.log(`Error in login :- ${error}`);

      toast.error(
        error.response?.data?.message || "Failed to login. Please try again",
        {
          autoClose: 2000,
        }
      );
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto my-10 p-6 bg-white rounded-xl border-1 shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>

          <p className="text-md">
            Doesn't have account?{" "}
            <span className="text-blue-400 ">
              <Link to="/register">Register</Link>
            </span>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
