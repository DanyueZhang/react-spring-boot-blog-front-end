import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";
import { BiUserCircle } from "react-icons/bi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    const userInfoJSON = window.localStorage.getItem("userInfo");

    if (userInfoJSON) {
      axios
        .get(process.env.REACT_APP_BACKEND_URL + "/user/checkToken", {
          headers: {
            token: JSON.parse(userInfoJSON).token,
          },
        })
        .then((res) => {
          navigate("/admin/posts");
        })
        .catch((err) => {
          window.localStorage.removeItem("userInfo");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitLogin = () => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + "/user/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        const userInfo = res.data;

        window.localStorage.setItem("userInfo", JSON.stringify(userInfo));

        navigate("/admin/posts");
      })
      .catch((err) => setIsError(true));
  };

  return (
    <Container className="d-flex flex-column align-items-center">
      <Form className="w-50 border rounded shadow p-3 mt-5 d-flex flex-column align-items-center animate__animated animate__slideInDown">
        <BiUserCircle
          className="mb-2"
          style={{ width: "60px", height: "60px" }}
        />

        <FloatingLabel label="Username" className="mb-3 w-75">
          <Form.Control
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel label="Password" className="mb-3 w-75">
          <Form.Control
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>

        <Button
          variant="primary"
          size="lg"
          className="px-5"
          onClick={submitLogin}
        >
          LOG IN
        </Button>

        {isError ? (
          <Alert
            variant="danger"
            className="mt-3 animate__animated animate__fadeIn"
          >
            Invalid Username or Password!
          </Alert>
        ) : (
          ""
        )}
      </Form>
    </Container>
  );
};

export default Login;
