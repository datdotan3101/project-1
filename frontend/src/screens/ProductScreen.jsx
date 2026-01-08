import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Gom import lại cho gọn
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";
import { addToCart } from "../slices/cartSlice"; // 👈 1. QUAN TRỌNG: Import action này

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`);
        setProduct(data);
      } catch (error) {
        console.error("Lỗi fetch sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // 👇 2. SỬA LOGIC NÀY
  const addToCartHandler = () => {
    // Bắn thông tin sản phẩm + số lượng vào Redux Store
    dispatch(addToCart({ ...product, qty }));

    // Chuyển hướng sang trang giỏ hàng
    navigate("/cart");
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Trở về
      </Link>

      {product.name && (
        <Row>
          <Col md={5}>
            <Image src={product.image} alt={product.name} fluid />
          </Col>

          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} đánh giá`}
                />
              </ListGroup.Item>
              <ListGroup.Item>
                Giá: {product.price?.toLocaleString("vi-VN")} đ
              </ListGroup.Item>
              <ListGroup.Item>Mô tả: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>

          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Giá:</Col>
                    <Col>
                      <strong>
                        {product.price?.toLocaleString("vi-VN")} đ
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Trạng thái:</Col>
                    <Col>
                      {product.countInStock > 0 ? "Còn hàng" : "Hết hàng"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Số lượng</Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler} // Gọi hàm handler mới
                  >
                    Thêm vào giỏ
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
