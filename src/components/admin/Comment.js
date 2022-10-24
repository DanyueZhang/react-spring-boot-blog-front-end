import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import Table from "react-bootstrap/Table";
import { FiTrash2 } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import SuccessAndFail from "../utils/SuccessAndFail";
import Button from "react-bootstrap/Button";

const Comment = () => {
  let navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

  const [comments, setComments] = useState([]);

  const [page, setPage] = useState(0);
  const [pageItems, setPageItems] = useState([]);

  const [deleteShow, setDeleteShow] = useState(false);

  const [deleteCommentId, setDeleteCommentId] = useState(0);

  const [successShow, setSuccessShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failShow, setFailShow] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userInfoJSON = window.localStorage.getItem("userInfo");

    if (userInfoJSON) {
      setUserInfo(JSON.parse(userInfoJSON));
      getCommentList(JSON.parse(userInfoJSON).token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCommentList = (token) => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/comment/getCommentsPge/0`, {
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

        setComments(data.content);
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
        process.env.REACT_APP_BACKEND_URL + `/comment/getCommentsPge/${i - 1}`,
        {
          headers: {
            token: userInfo.token,
          },
        }
      )
      .then((res) => {
        setComments(res.data.content);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const deleteComment = (commentId) => {
    setDeleteShow(true);
    setDeleteCommentId(commentId);
  };

  const submitDeleteComment = () => {
    axios
      .delete(
        process.env.REACT_APP_BACKEND_URL +
          `/comment/deleteComment/${deleteCommentId}`,
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
        getCommentList(userInfo.token);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  return (
    <Container className="mt-3 overflow-auto">
      <Row className="mt-3">
        <Col>
          <Table hover className="border shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Content</th>
                <th>Create Time</th>
                <th>Reply To</th>
                <th>Article Title</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.id}</td>
                  <td>{comment.name}</td>
                  <td>{comment.content}</td>
                  <td>
                    {new Date(comment.createTime).toLocaleDateString("en-US")}
                  </td>
                  <td>{comment.replyTo}</td>
                  <td>{comment.articleName}</td>
                  <td>
                    <div
                      className="text-danger"
                      role="button"
                      onClick={(e) => deleteComment(comment.id)}
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

      <Row>
        <Col>
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
        </Col>
      </Row>

      <Modal show={deleteShow} onHide={() => setDeleteShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure to delete this comment?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={submitDeleteComment}>
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

export default Comment;
