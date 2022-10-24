import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MDEditor from "@uiw/react-md-editor";
import { FiCalendar } from "react-icons/fi";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import Avatar from "boring-avatars";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";

const Article = () => {
  let { articleId } = useParams();

  const [article, setArticle] = useState(null);

  const [isLiked, setIsLiked] = useState(false);

  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [replyTo, setReplyTo] = useState("");

  const [successShow, setSuccessShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failShow, setFailShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [replyShow, setReplyShow] = useState(false);

  useEffect(() => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          `/article/getArticlePublic/${articleId}`
      )
      .then((res) => {
        res.data.comments.sort(
          (a, b) => new Date(b.createTime) - new Date(a.createTime)
        );

        setArticle(res.data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClickLike = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL + `/article/likeArticle/${articleId}`
      )
      .then((res) => {
        setIsLiked(true);
        setArticle({ ...article, likeCount: article.likeCount + 1 });
      });
  };

  const submitComment = () => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/comment/submitComment`, {
        name: commentName,
        content: commentContent,
        articleId: articleId,
        replyTo: replyTo,
      })
      .then((res) => {
        let comments = article.comments;

        comments.unshift(res.data);

        setArticle({
          ...article,
          comments: comments,
        });

        setReplyShow(false);

        setCommentName("");
        setCommentContent("");
        setReplyTo("");

        setSuccessShow(true);
        setSuccessMessage("Thanks for your comment!");
        setTimeout(() => {
          setSuccessShow(false);
        }, "3000");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setFailShow(true);
          setErrorMessage("Name or comment is empty!");
          setTimeout(() => {
            setFailShow(false);
          }, "3000");
        }
      });
  };

  const openReply = (to) => {
    setCommentName("");
    setCommentContent("");
    setReplyShow(true);
    setReplyTo(to);
  };

  const hideReply = () => {
    setReplyShow(false);
    setCommentName("");
    setCommentContent("");
    setReplyTo("");
  };

  return (
    <div>
      {article !== null ? (
        <Container className="mt-3">
          <Row>
            <Col>
              <h1 className="text-center">{article.title}</h1>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mb-3 text-muted d-flex align-items-center justify-content-center">
                <FiCalendar className="me-1" />
                {new Date(article.createTime).toLocaleDateString("en-US")}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="mb-4 text-break fst-italic bg-light shadow p-3 rounded">
                {article.introduction}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <MDEditor.Markdown source={article.content} className="mb-4" />
            </Col>
          </Row>

          <Row>
            <Col className="text-center">
              {isLiked ? (
                <BsHeartFill
                  style={{ width: "50px", height: "50px", color: "#ff1a75" }}
                />
              ) : (
                <BsHeart
                  onClick={onClickLike}
                  role="button"
                  style={{ width: "50px", height: "50px", color: "#ff1a75" }}
                />
              )}
              <p className="text-black">{article.likeCount}</p>
            </Col>
          </Row>

          <Row>
            <Col className="w-100 d-flex">
              <Avatar
                size={60}
                name={commentName}
                variant="beam"
                colors={["#E4F3D8", "#AFCACC", "#FFA02E", "#E80560", "#331D4A"]}
              />
              <div className="ms-2 w-100 d-flex flex-column">
                <Form.Control
                  className="w-25 mb-2"
                  placeholder="name"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                />
                <div className="d-flex">
                  <Form.Control
                    className="me-2"
                    as="textarea"
                    rows={1}
                    placeholder="Leave your comment"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <Button variant="primary" onClick={submitComment}>
                    Submit
                  </Button>
                </div>
                <hr />
              </div>
            </Col>
          </Row>

          {article.comments.map((comment) => (
            <Row key={comment.id}>
              <Col className="w-100 d-flex mb-3 animate__animated animate__fadeInDown">
                <Avatar
                  size={60}
                  name={comment.name}
                  variant="beam"
                  colors={[
                    "#E4F3D8",
                    "#AFCACC",
                    "#FFA02E",
                    "#E80560",
                    "#331D4A",
                  ]}
                />
                <div className="ms-3 w-100 d-flex flex-column">
                  <p className="text-secondary mb-1">{comment.name}</p>
                  <div className="mb-1">
                    {comment.replyTo === null ? (
                      ""
                    ) : (
                      <div className="d-inline me-2">
                        Reply to{" "}
                        <div className="d-inline text-primary">
                          @{comment.replyTo}
                        </div>{" "}
                        :
                      </div>
                    )}
                    {comment.content}
                  </div>
                  <div
                    className="text-secondary mb-0 d-flex"
                    style={{ fontSize: "5px" }}
                  >
                    <p className="me-3">
                      {new Date(comment.createTime).toLocaleDateString("en-US")}
                    </p>
                    <p
                      role="button"
                      className="reply"
                      onClick={() => openReply(comment.name)}
                    >
                      reply
                    </p>
                  </div>
                  <hr className="mt-1 mb-1" />
                </div>
              </Col>
            </Row>
          ))}

          <Row>
            <Col className="text-center text-secondary fw-light mb-3">
              no more comments
            </Col>
          </Row>
        </Container>
      ) : (
        <div className="text-center mt-3">
          <Spinner animation="grow" className="me-2" />
          <Spinner animation="grow" className="me-2" />
          <Spinner animation="grow" />
        </div>
      )}

      {failShow ? (
        <div
          className="position-fixed w-100 d-flex justify-content-center"
          style={{
            top: "10%",
            zIndex: "10000",
          }}
        >
          <Alert
            variant="danger"
            className="shadow animate__animated animate__fadeInDown text-center"
          >
            {errorMessage}
          </Alert>
        </div>
      ) : null}

      {successShow ? (
        <div
          className="position-fixed w-100 d-flex justify-content-center"
          style={{
            top: "10%",
            zIndex: "10000",
          }}
        >
          <Alert
            variant="success"
            className="shadow animate__animated animate__fadeInDown text-center"
          >
            {successMessage}
          </Alert>
        </div>
      ) : null}

      <Modal show={replyShow} onHide={hideReply}>
        <Modal.Header closeButton>
          <Modal.Title>
            Reply to <p className="text-secondary d-inline">{replyTo}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="w-100 d-flex">
          <Avatar
            size={60}
            name={commentName}
            variant="beam"
            colors={["#E4F3D8", "#AFCACC", "#FFA02E", "#E80560", "#331D4A"]}
          />
          <div className="w-100 ms-2">
            <Form.Control
              placeholder="name"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="mb-2 w-50"
            />
            <Form.Control
              as="textarea"
              placeholder="Leave your comment"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitComment}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Article;
