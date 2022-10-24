import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BiPlus } from "react-icons/bi";
import Modal from "react-bootstrap/Modal";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import SuccessAndFail from "../utils/SuccessAndFail";

const Tags = () => {
  let navigate = useNavigate();

  const [newTagShow, setNewTagShow] = useState(false);
  const [editTagShow, setEditTagShow] = useState(false);
  const [newTagValue, setNewTagValue] = useState("");
  const [editTagValue, setEditTagValue] = useState(null);
  const [successShow, setSuccessShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failShow, setFailShow] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [page, setPage] = useState(0);
  const [pageItems, setPageItems] = useState([]);
  const [tags, setTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteShow, setDeleteShow] = useState(false);
  const [delteTagValue, setDeleteTagValue] = useState(null);

  const pageItemEvent = (i) => {
    setPage(i - 1);

    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/tag/getTagsPage/${i - 1}`, {
        headers: {
          token: userInfo.token,
        },
      })
      .then((res) => {
        setTags(res.data.content);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  useEffect(() => {
    const userInfoJSON = window.localStorage.getItem("userInfo");

    if (userInfoJSON) {
      setUserInfo(JSON.parse(userInfoJSON));
      getTagList(JSON.parse(userInfoJSON).token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTagList = (token) => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/tag/getTagsPage/0`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        const data = res.data;

        let items = [];

        for (let i = 1; i <= data.totalPages; i++) {
          items.push(i);
        }

        setPage(0);
        setPageItems(items);
        setTags(data.content);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const submitAddNewTag = () => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_URL +
          `/tag/newTag?tagName=${newTagValue}`,
        null,
        {
          headers: {
            token: userInfo.token,
          },
        }
      )
      .then((res) => {
        setNewTagShow(false);
        setSuccessMessage(res.data);
        setSuccessShow(true);
        setNewTagValue("");
        getTagList(userInfo.token);
      })
      .catch((err) => {
        setNewTagShow(false);
        setNewTagValue("");

        if (err.response.status === 400) {
          setFailShow(true);
          setErrorMessage(err.response.data);
        } else if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const editTag = (e) => {
    setEditTagValue(e);
    setEditTagShow(true);
  };

  const deleteTag = (e) => {
    setDeleteTagValue(e);
    setDeleteShow(true);
  };

  const submitDeleteTag = () => {
    axios
      .delete(
        process.env.REACT_APP_BACKEND_URL +
          `/tag/deleteTag/${delteTagValue.id}`,
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
        getTagList(userInfo.token);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const submitEditTag = () => {
    axios
      .put(process.env.REACT_APP_BACKEND_URL + `/tag/editTag`, editTagValue, {
        headers: {
          token: userInfo.token,
        },
      })
      .then((res) => {
        setEditTagShow(false);
        setSuccessMessage(res.data);
        setSuccessShow(true);
        getTagList(userInfo.token);
      })
      .catch((err) => {
        setEditTagShow(false);

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
        <Col>
          <Button variant="primary" onClick={() => setNewTagShow(true)}>
            <BiPlus />
            New Tag
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Table hover className="border shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Tag Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id}>
                  <td>{tag.id}</td>
                  <td>{tag.name}</td>
                  <td className="d-flex">
                    <div
                      className="text-primary me-3"
                      role="button"
                      onClick={(e) => editTag(tag)}
                    >
                      <FiEdit2 className="me-1" />
                      Edit
                    </div>
                    <div
                      className="text-danger"
                      role="button"
                      onClick={(e) => deleteTag(tag)}
                    >
                      <FiTrash2 className="me-1" />
                      Delete
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

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

      <Modal show={newTagShow} onHide={() => setNewTagShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            value={newTagValue}
            onChange={(e) => setNewTagValue(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitAddNewTag}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={editTagShow} onHide={() => setEditTagShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tag</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            value={editTagValue ? editTagValue.name : ""}
            onChange={(e) => {
              setEditTagValue({ ...editTagValue, name: e.target.value });
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitEditTag}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={deleteShow} onHide={() => setDeleteShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure to delete this tag?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={submitDeleteTag}>
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

export default Tags;
