import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { BsChatLeftText } from "react-icons/bs";
import { FiFileText, FiTag, FiInfo } from "react-icons/fi";
import { BiUserCircle } from "react-icons/bi";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { useState, useEffect } from "react";
import axios from "axios";

import "react-pro-sidebar/dist/css/styles.css";
import "../../App.css";

const Admin = () => {
  let navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userInfoJSON = window.localStorage.getItem("userInfo");

    if (!userInfoJSON) {
      navigate("/login");
    } else {
      axios
        .get(process.env.REACT_APP_BACKEND_URL + "/user/checkToken", {
          headers: {
            token: JSON.parse(userInfoJSON).token,
          },
        })
        .then((res) => {
          setUserInfo(JSON.parse(userInfoJSON));
        })
        .catch((err) => {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + "/user/logout", {
        headers: {
          token: userInfo.token,
        },
      })
      .then((res) => {
        window.localStorage.removeItem("userInfo");
        navigate("/");
      })
      .catch((err) => {
        window.localStorage.removeItem("userInfo");
        navigate("/");
      });
  };

  return (
    <div className="h-100 d-flex flex-column">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Admin</Navbar.Brand>
          <Nav>
            <OverlayTrigger
              trigger="click"
              placement="bottom"
              overlay={
                <Popover id="popover-logout">
                  <Popover.Body>
                    <Nav.Link onClick={logout}>Logout</Nav.Link>
                  </Popover.Body>
                </Popover>
              }
            >
              <Nav.Link>
                <BiUserCircle style={{ width: "30px", height: "30px" }} />
              </Nav.Link>
            </OverlayTrigger>
          </Nav>
        </Container>
      </Navbar>
      <div className="w-100 h-100 d-flex">
        <ProSidebar>
          <Menu iconShape="circle">
            <MenuItem icon={<FiFileText />}>
              Posts
              <Link to="/admin/posts" />
            </MenuItem>
            <MenuItem icon={<FiTag />}>
              Tags
              <Link to="/admin/tags" />
            </MenuItem>
            <MenuItem icon={<BsChatLeftText />}>
              Comments
              <Link to="/admin/comments" />
            </MenuItem>
            <MenuItem icon={<FiInfo />}>
              About
              <Link to="/admin/about" />
            </MenuItem>
          </Menu>
        </ProSidebar>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
