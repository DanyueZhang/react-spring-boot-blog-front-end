import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { FiCalendar } from "react-icons/fi";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InfiniteScroll from "react-infinite-scroller";
import { useState } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Badge from "react-bootstrap/Badge";

const Categories = () => {
  let { tagId } = useParams();

  const [blogs, setBlogs] = useState([]);

  const [hasMore, setHasMore] = useState(true);

  const [page, setPage] = useState(0);

  const loadFunc = () => {
    axios
      .get(
        process.env.REACT_APP_BACKEND_URL +
          `/article/getArticlesPageByTagId/${page}/${tagId}`
      )
      .then((res) => {
        const data = res.data;

        if (page + 1 >= data.totalPages) {
          setHasMore(false);
        } else {
          setPage(page + 1);
        }

        setBlogs(
          blogs.concat(
            data.content.map((article) => {
              return {
                ...article,
                createTime: new Date(article.createTime).toLocaleDateString(
                  "en-US"
                ),
              };
            })
          )
        );
      });
  };

  return (
    <Container className="mt-3 mb-3">
      <Row>
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
          {blogs.map((blog) => (
            <Card
              className="mb-3 animate__animated animate__fadeIn animate__slow"
              key={blog.id}
            >
              <Card.Body>
                <Card.Title>{blog.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted d-flex align-items-center">
                  <FiCalendar className="me-1" />
                  {blog.createTime}
                </Card.Subtitle>
                <Card.Text>{blog.introduction}</Card.Text>
                {blog.tags.map((tag) => (
                  <Badge key={tag.id} bg="primary" className="me-2">
                    <div className="me-1">{tag.name}</div>
                  </Badge>
                ))}
                <Card.Link href={`/article/${blog.id}`} className="float-end">
                  Read More
                </Card.Link>
              </Card.Body>
            </Card>
          ))}
        </InfiniteScroll>
      </Row>

      {hasMore ? null : (
        <Row>
          <Col className="text-center text-secondary fw-light">
            no more articles
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Categories;
