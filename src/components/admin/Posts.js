import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BiPlus } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Modal from "react-bootstrap/Modal";
import SuccessAndFail from "../utils/SuccessAndFail";

const Posts = () => {
  let navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

  const [page, setPage] = useState(0);
  const [pageItems, setPageItems] = useState([]);

  const [articles, setArticles] = useState([]);

  const [deleteShow, setDeleteShow] = useState(false);

  const [deleteArticleId, setDeleteArticleId] = useState(0);

  const [successShow, setSuccessShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failShow, setFailShow] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const userInfoJSON = window.localStorage.getItem("userInfo");

    if (userInfoJSON) {
      setUserInfo(JSON.parse(userInfoJSON));
      getArticleList(JSON.parse(userInfoJSON).token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArticleList = (token) => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/article/getArticlesPage/0`, {
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

        setArticles(
          data.content.map((article) => {
            return {
              ...article,
              createTime: new Date(article.createTime),
            };
          })
        );
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
        process.env.REACT_APP_BACKEND_URL + `/article/getArticlesPage/${i - 1}`,
        {
          headers: {
            token: userInfo.token,
          },
        }
      )
      .then((res) => {
        setArticles(
          res.data.content.map((article) => {
            return {
              ...article,
              createTime: new Date(article.createTime),
            };
          })
        );
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.localStorage.removeItem("userInfo");
          navigate("/login");
        }
      });
  };

  const editArticle = (article) => {
    navigate(`/admin/editor/${article.id}`);
  };

  const deleteArticle = (article) => {
    setDeleteShow(true);
    setDeleteArticleId(article.id);
  };

  const submitDeleteArticle = () => {
    axios
      .delete(
        process.env.REACT_APP_BACKEND_URL +
          `/article/deleteArticle/${deleteArticleId}`,
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
        getArticleList(userInfo.token);
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
      <Row>
        <Col>
          <Button
            variant="primary"
            onClick={() => navigate(`/admin/editor/-1`)}
          >
            <BiPlus />
            New Post
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
          <Table hover className="border shadow-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Introduction</th>
                <th>Create Time</th>
                <th>Like Count</th>
                <th>Tags</th>
                <th>Public</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.id}</td>
                  <td>{article.title}</td>
                  <td>
                    <div className="text-truncate" style={{ width: "128px" }}>
                      {article.introduction}
                    </div>
                  </td>
                  <td>{article.createTime.toLocaleDateString("en-US")}</td>
                  <td>{article.likeCount}</td>
                  <td>
                    {article.tags.map((tag) => (
                      <Badge key={tag.id} bg="primary" className="me-2">
                        <div className="me-1">{tag.name}</div>
                      </Badge>
                    ))}
                  </td>
                  <td>
                    <Form.Check
                      disabled
                      type="switch"
                      className="w-25"
                      checked={article.status}
                    />
                  </td>
                  <td className="d-flex">
                    <div
                      className="text-primary me-3"
                      role="button"
                      onClick={(e) => editArticle(article)}
                    >
                      <FiEdit3 className="me-1" />
                      Edit
                    </div>
                    <div
                      className="text-danger"
                      role="button"
                      onClick={(e) => deleteArticle(article)}
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
          <Modal.Title>Are you sure to delete this article?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="danger" onClick={submitDeleteArticle}>
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

export default Posts;
