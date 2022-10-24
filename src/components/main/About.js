import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Avatar from "boring-avatars";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";
import Spinner from "react-bootstrap/Spinner";

const About = () => {
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [replyTo, setReplyTo] = useState("");

  const [comments, setComments] = useState([]);

  const [successShow, setSuccessShow] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [failShow, setFailShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [replyShow, setReplyShow] = useState(false);

  const [page, setPage] = useState(0);

  const [hasMore, setHasMore] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL + `/about/getAbout`)
      .then((res) => {
        if (res.data !== "") {
          setAvatarUrl(res.data.avatar);
          setContent(res.data.content);
        }
      });
  }, []);

  const loadFunc = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          `/comment/getAboutCommentsPage/${page}`
      )
      .then((res) => {
        const data = res.data;

        if (page + 1 >= data.totalPages) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }

        setComments(comments.concat(data.content));
      });
  };

  const submitComment = () => {
    axios
      .post(process.env.REACT_APP_BACKEND_URL + `/comment/submitComment`, {
        name: commentName,
        content: commentContent,
        replyTo: replyTo,
      })
      .then((res) => {
        let oldComments = comments;

        oldComments.unshift(res.data);

        setComments(oldComments);

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
    <>
      <Container>
        <Row className="mt-3">
          <Col sm={2} className="d-flex justify-content-center">
            <Image src={avatarUrl} roundedCircle={true} className="mw-100" />
          </Col>
          <Col>
            <h1>About</h1>
            <p>{content}</p>
          </Col>
          <hr className="mt-3" />
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

        <InfiniteScroll
          initialLoad={true}
          loadMore={loadFunc}
          hasMore={hasMore}
          loader={
            <div key={0} className="text-center">
              <Spinner animation="grow" className="me-2" />
              <Spinner animation="grow" className="me-2" />
              <Spinner animation="grow" />
            </div>
          }
        >
          {comments.map((comment) => (
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
        </InfiniteScroll>

        {hasMore ? null : (
          <Row>
            <Col className="text-center text-secondary fw-light mb-3">
              no more comments
            </Col>
          </Row>
        )}
      </Container>

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
    </>
  );
};

export default About;
