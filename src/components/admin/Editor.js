import { useState, useEffect } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import Container from "react-bootstrap/Container";
import { FiImage } from "react-icons/fi";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SuccessAndFail from "../utils/SuccessAndFail";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import { FiEye, FiTrash2, FiCheckCircle } from "react-icons/fi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";

const Editor = () => {
  let navigate = useNavigate();

  let { id } = useParams();

  const [value, setValue] = useState("**Hello world!!!**");
  const [newImageShow, setNewImageShow] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [selectImageShow, setSelectImageShow] = useState(false);
  const [images, setImages] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [createTime, setCreateTime] = useState("");

  const [successShow, setSuccessShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failShow, setFailShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [page, setPage] = useState(0);
  const [pageItems, setPageItems] = useState([]);

  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteImageId, setDeleteImageId] = useState("");

  useEffect(() => {
    const userInfoJSON = window.localStorage.getItem("userInfo");

    if (id !== "-1") {
      axios
        .all([
          axios.get(
            process.env.REACT_APP_BACKEND_URL + `/article/getArticle/${id}`,
            {
              headers: {
                token: JSON.parse(userInfoJSON).token,
              },
            }
          ),
          axios.get(process.env.REACT_APP_BACKEND_URL + "/tag/getAllTags", {
            headers: {
              token: JSON.parse(userInfoJSON).token,
            },
          }),
        ])
        .then(
          axios.spread((res1, res2) => {
            const blog = res1.data;
            const restTags = res2.data;

            setValue(blog.content);
            setIntroduction(blog.introduction);
            setTitle(blog.title);
            setSelectedTags(blog.tags);
            setIsPublic(blog.status);
            setCreateTime(blog.createTime);

            setTags(
              restTags.filter(
                (tag) => blog.tags.find((t) => t.id === tag.id) === undefined
              )
            );
          })
        )
        .catch((err) => {
          if (err.response.status === 401) {
            window.localStorage.removeItem("userInfo");
            navigate("/login");
          }
        });
    } else {
      axios
        .get(process.env.REACT_APP_BACKEND_URL + "/tag/getAllTags", {
          headers: {
            token: JSON.parse(userInfoJSON).token,
          },
        })
        .then((res) => setTags(res.data))
        .catch((err) => {
          if (err.response.status === 401) {
            window.localStorage.removeItem("userInfo");
            navigate("/login");
          }
        });
    }

    if (userInfoJSON) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setUserInfo(JSON.parse(userInfoJSON));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveArticle = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL + `/article/saveArticle`,
        {
          id: id,
          title: title,
          introduction: introduction,
          content: value,
          status: isPublic,
          tags: selectedTags,
          createTime: createTime,
        },
        {
          headers: {
            token: userInfo.token,
          },
        }
      )
      .then((res) => {
        setSuccessMessage(res.data);
        setSuccessShow(true);
        navigate("/admin/posts");
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
  };

  const onSelectTagChange = (tag) => {
    const newTag = JSON.parse(tag);

    setSelectedTags(selectedTags.concat(newTag));
    setTags(tags.filter((t) => t.id !== newTag.id));
  };

  const deleteSelectedTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tag.id));
    setTags(tags.concat(tag));
  };

  const deleteImage = (id) => {
    setDeleteImageId(id);
    setDeleteShow(true);
  };

  const submitDeleteImage = () => {
    axios
      .delete(
        process.env.REACT_APP_BACKEND_URL +
          `/image/deleteImage/${deleteImageId}`,
        {
          headers: {
            token: userInfo.token,
          },
        }
      )
      .then((res) => {
        setDeleteShow(false);
        setSuccessMessage(res.data);
        setSuccessShow(true);
        getImageList();
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const getImageList = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/image/getImagesPage/0`, {
        headers: {
          token: userInfo.token,
        },
      })
      .then((res) => {
        const data = res.data;

        setImages(data.content);

        let items = [];

        for (let i = 1; i <= data.totalPages; i++) {
          items.push(i);
        }

        setPage(0);
        setPageItems(items);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const pageItemEvent = (i) => {
    setPage(i - 1);

    axios
      .get(
        process.env.REACT_APP_BACKEND_URL + `/image/getImagesPage/${i - 1}`,
        {
          headers: {
            token: userInfo.token,
          },
        }
      )
      .then((res) => {
        setImages(res.data.content);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const insertImage = (filepath) => {
    navigator.clipboard.writeText(`![](${filepath})`);
    setSelectImageShow(false);
    setSuccessMessage("Copy link to the clipboard!");
    setSuccessShow(true);
  };

  const addNewImage = () => {
    setNewImageShow(true);
  };

  const selectImage = () => {
    const user = JSON.parse(window.localStorage.getItem("userInfo"));

    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/image/getImagesPage/0`, {
        headers: {
          token: user.token,
        },
      })
      .then((res) => {
        const data = res.data;

        setImages(data.content);

        let items = [];

        for (let i = 1; i <= data.totalPages; i++) {
          items.push(i);
        }

        setPage(0);
        setPageItems(items);
        setSelectImageShow(true);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const uploadNewImage = () => {
    let formData = new FormData();

    formData.append("file", newImage);

    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          `/image/uploadImage?name=${imageName}`,
        formData,
        {
          headers: {
            token: userInfo.token,
          },
        }
      )
      .then((res) => {
        setNewImage(null);
        setImageName("");
        setNewImageShow(false);

        setSuccessMessage(res.data);
        setSuccessShow(true);
      })
      .catch((err) => {
        setNewImage(null);
        setImageName("");
        setNewImageShow(false);

        if (err.response.status === 400) {
          setFailShow(true);
          setErrorMessage(err.response.data);
        } else if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  return (
    <Container className="mt-3 overflow-auto">
      <Row>
        <Col className="d-flex flex-row align-items-center mb-3">
          <div className="fw-bold me-3">Title</div>
          <Form.Control
            className="w-25"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col className="d-flex flex-row align-items-center mb-3">
          <div className="fw-bold me-3">Introduction</div>
          <Form.Control
            as="textarea"
            rows={5}
            className="w-50"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col className="d-flex flex-row align-items-center mb-3">
          <div className="fw-bold me-3">Tags</div>
          {selectedTags.map((tag) => (
            <Badge
              key={tag.id}
              bg="primary"
              className="me-2 d-flex flex-row align-items-center"
            >
              <div className="me-1">{tag.name}</div>
              <CloseButton onClick={(e) => deleteSelectedTag(tag)} />
            </Badge>
          ))}
          <Form.Select
            aria-label="Add tags"
            className="w-25"
            onChange={(e) => onSelectTagChange(e.target.value)}
          >
            <option>Add a new tag</option>
            {tags.map((tag) => (
              <option key={tag.id} value={JSON.stringify(tag)}>
                {tag.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <Row>
        <Col className="d-flex flex-row align-items-center mb-3">
          <div className="fw-bold me-3">Public</div>
          <Form.Check
            type="switch"
            className="w-25"
            checked={isPublic}
            onChange={(e) => setIsPublic(!isPublic)}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <MDEditor
            value={value}
            onChange={setValue}
            commands={[
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.hr,
              commands.title,
              commands.divider,
              commands.link,
              commands.quote,
              commands.code,
              commands.divider,
              commands.group([], {
                name: "image",
                groupName: "image",
                icon: <FiImage />,
                buttonProps: { "aria-label": "Image" },
                children: (handle) => {
                  return (
                    <div style={{ width: 120, padding: 10 }}>
                      <Button
                        className="mb-1"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          addNewImage();
                        }}
                      >
                        New image
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          selectImage();
                        }}
                      >
                        Select image
                      </Button>
                    </div>
                  );
                },
              }),
            ]}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          <Button variant="primary" onClick={saveArticle}>
            Save
          </Button>
        </Col>
      </Row>

      <Modal show={selectImageShow} onHide={() => setSelectImageShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select An Image To Insert</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <tr key={image.id}>
                  <td>{image.id}</td>
                  <td>{image.name}</td>
                  <td className="d-flex">
                    <div
                      className="text-primary me-3"
                      role="button"
                      onClick={(e) => insertImage(image.filepath)}
                    >
                      <FiCheckCircle className="me-1" />
                      Select
                    </div>
                    <a
                      className="text-info me-3"
                      role="button"
                      href={image.filepath}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FiEye className="me-1" />
                      View
                    </a>
                    <div
                      className="text-danger"
                      role="button"
                      onClick={(e) => deleteImage(image.id)}
                    >
                      <FiTrash2 className="me-1" />
                      Delete
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {pageItems.map((pageItem) => (
              <Pagination.Item
                key={pageItem}
                active={pageItem === page + 1}
                onClick={(e) => pageItemEvent(pageItem)}
              >
                {pageItem}
              </Pagination.Item>
            ))}
          </Pagination>
        </Modal.Body>
      </Modal>

      <Modal show={newImageShow} onHide={() => setNewImageShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload New Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="d-flex flex-row align-items-center mb-2">
            <Form.Label className="me-2">Name:</Form.Label>
            <Form.Control
              value={imageName}
              onChange={(e) => setImageName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Control
            type="file"
            accept="image/png, image/jpeg, image/gif"
            onChange={(e) => setNewImage(e.target.files[0])}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={uploadNewImage}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteShow} onHide={() => setDeleteShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure to delete this image?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={submitDeleteImage}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setDeleteShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

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

export default Editor;
