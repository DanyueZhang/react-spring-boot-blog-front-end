import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SuccessAndFail from "../utils/SuccessAndFail";

const AboutEditor = () => {
  let navigate = useNavigate();

  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [content, setContent] = useState("");

  const [userInfo, setUserInfo] = useState(null);

  const [successShow, setSuccessShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failShow, setFailShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userInfoJSON = window.localStorage.getItem("userInfo");

    if (userInfoJSON) {
      setUserInfo(JSON.parse(userInfoJSON));
    }

    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/about/getAbout`)
      .then((res) => {
        if (res.data !== "") {
          setAvatarUrl(res.data.avatar);
          setContent(res.data.content);
        }
      });
  }, []);

  const saveAbout = () => {
    if (avatar === null || avatar === undefined) {
      setFailShow(true);
      setErrorMessage("Image is empty!");
    } else {
      let formData = new FormData();

      formData.append("file", avatar);

      axios
        .put(
          process.env.REACT_APP_BACKEND_URL +
            `/about/changeAbout?content=${content}`,
          formData,
          {
            headers: {
              token: userInfo.token,
            },
          }
        )
        .then((res) => {
          setSuccessMessage(res.data);
          setSuccessShow(true);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            window.localStorage.removeItem("userInfo");
            navigate("/login");
          } else if (err.response.status === 400) {
            setFailShow(true);
            setErrorMessage(err.response.data);
          }
        });
    }
  };

  return (
    <Container className="mt-3 overflow-auto">
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="fs-3">Avatar</Form.Label>
              <div>
                {avatarUrl === "" ? null : (
                  <Image
                    src={avatarUrl}
                    roundedCircle={true}
                    style={{ height: "200px", width: "200px" }}
                  />
                )}

                <Form.Control
                  className="w-25 mt-3"
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={(e) => {
                    setAvatar(e.target.files[0]);
                    setAvatarUrl(
                      e.target.files[0] === undefined
                        ? ""
                        : URL.createObjectURL(e.target.files[0])
                    );
                  }}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fs-3">Content</Form.Label>
              <Form.Control
                className="w-50"
                as="textarea"
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" size="lg" onClick={() => saveAbout()}>
              Save
            </Button>
          </Form>
        </Col>
      </Row>

      <SuccessAndFail
        setSuccessShow={setSuccessShow}
        successShow={successShow}
        successMessage={successMessage}
        setFailShow={setFailShow}
        failShow={failShow}
        errorMessage={errorMessage}
      />
    </Container>
  );
};

export default AboutEditor;
