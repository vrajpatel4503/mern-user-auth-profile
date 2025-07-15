import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {useDispatch} from "react-redux"
import { authActions } from "../../store/authSlice.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col justify-between pt-6 shadow-lg">
      {/* Top Section */}
      <div>
        <h2 className="text-3xl font-bold mb-8 text-center">Dashboard</h2>

        <nav className="flex flex-col space-y-4">
          <Link to="/profile" className="hover:text-gray-300 text-xl pl-4">
            My Profile
          </Link>
          <hr className="w-full border-t border-white-600" />

          <Link to="/edit-Profile" className="hover:text-gray-300 text-xl pl-4">
            Edit Profile
          </Link>
          <hr className="w-full border-t border-white-600" />
        </nav>
      </div>

      {/* Bottom Section */}
      <div>
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded text-lg"
          onClick={async () => {
            try {
              const res = await axios.post(
                `http://localhost:8000/api/v1/user/logout`,
                {},
                { withCredentials: true }
              );

              dispatch(authActions.logout());
              
              

              toast.success(res.data.message || "logged out successfull", {
                autoClose: 1000,
              });

              setTimeout(() => {
                navigate("/login");
              }, 2000);

              // try part end
            } catch (error) {
              toast.error(error.response?.data?.message || "Failed to log out", {
                autoClose: 2000,
              });
            }
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
