import { Outlet } from "react-router-dom";
import Footer from "../Footer/Footer.jsx";

const Layout = () => {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
