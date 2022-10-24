import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { BiUserCircle } from "react-icons/bi";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Outlet } from "react-router-dom";
import React, { useState, useEffect } from "react";

import "../../App.css";
import axios from "axios";

const Main = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/tag/getUsedTags`)
      .then((res) => setCategories(res.data));
  }, []);

  return (
    <div className="h-100 d-flex flex-column justify-content-between">
      <div>
        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
          <Container>
            <Navbar.Brand href="/">Blog</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <NavDropdown
                  title="Categories"
                  id="basic-nav-dropdown"
                  menuVariant="dark"
                >
                  {categories.map((category) => (
                    <NavDropdown.Item
                      href={`/categories/${category.id}`}
                      key={category.id}
                    >
                      {category.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
                <Nav.Link href="/about">About</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="/login">
                  <BiUserCircle style={{ width: "30px", height: "30px" }} />
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Outlet />
      </div>
      <div className="text-center p-4 bg-light">
        © 2022 Copyright: Danyue Zhang
      </div>
    </div>
  );
};

export default Main;
