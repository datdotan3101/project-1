import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  InputGroup,
} from "react-bootstrap";
import Rating from "../components/Rating";
import axios from "axios";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  // 👇 Mặc định luôn là 1
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

  const addToCartHandler = () => {
    // Nếu ô nhập đang trống hoặc lỗi, tự động hiểu là 1
    const finalQty = Number(qty) > 0 ? Number(qty) : 1;
    dispatch(addToCart({ ...product, qty: finalQty }));
    navigate("/cart");
  };

  // 👇 Logic nút Trừ (-)
  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  // 👇 Logic nút Cộng (+)
  const increaseQty = () => {
    if (qty < product.countInStock) setQty(qty + 1);
  };

  // 👇 Logic khi gõ phím vào ô input
  const handleInputChange = (e) => {
    const value = e.target.value;

    // Cho phép xóa trắng để gõ số mới (nếu chặn luôn thì rất khó sửa số)
    if (value === "") {
      setQty("");
      return;
    }

    const numValue = Number(value);
    // Chỉ cập nhật nếu là số
    if (!isNaN(numValue)) {
      if (numValue > product.countInStock) {
        setQty(product.countInStock); // Không cho quá kho
      } else {
        setQty(numValue);
      }
    }
  };

  // 👇 QUAN TRỌNG: Logic khi click chuột ra ngoài (Blur)
  // Nếu đang để trống hoặc số 0 -> Tự động nhảy về 1
  const handleBlur = () => {
    if (Number(qty) < 1 || qty === "") {
      setQty(1);
    }
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
                        <InputGroup>
                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={decreaseQty}
                          >
                            -
                          </Button>

                          <Form.Control
                            type="number"
                            min="1" // HTML input chặn số âm khi bấm nút tăng giảm mặc định
                            value={qty}
                            onChange={handleInputChange}
                            onBlur={handleBlur} // 👈 Bắt sự kiện click ra ngoài để reset về 1
                            className="text-center"
                            style={{ padding: "0.25rem 0.5rem" }}
                          />

                          <Button
                            variant="outline-dark"
                            size="sm"
                            onClick={increaseQty}
                          >
                            +
                          </Button>
                        </InputGroup>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
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
