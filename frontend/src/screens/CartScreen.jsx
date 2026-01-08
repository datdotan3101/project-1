import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
  InputGroup,
} from "react-bootstrap"; // 👈 Import InputGroup
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Hàm xử lý update Redux khi đổi số lượng
  const updateQtyHandler = (product, newQty) => {
    // Chặn: Không cho nhỏ hơn 1 và không quá tồn kho
    if (newQty >= 1 && newQty <= product.countInStock) {
      dispatch(addToCart({ ...product, qty: newQty }));
    }
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: "20px" }}>Giỏ hàng</h1>
        {cartItems.length === 0 ? (
          <div className="alert alert-info">
            Giỏ hàng trống <Link to="/">Quay lại mua sắm</Link>
          </div>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  {" "}
                  {/* Căn giữa theo chiều dọc */}
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>{item.price.toLocaleString("vi-VN")}đ</Col>
                  {/* 👇 GIAO DIỆN SỐ LƯỢNG MỚI CHO GIỎ HÀNG */}
                  <Col md={3}>
                    <InputGroup size="sm">
                      <Button
                        variant="outline-dark"
                        onClick={() => updateQtyHandler(item, item.qty - 1)}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={item.qty}
                        className="text-center"
                        onChange={(e) =>
                          updateQtyHandler(item, Number(e.target.value))
                        }
                      />
                      <Button
                        variant="outline-dark"
                        onClick={() => updateQtyHandler(item, item.qty + 1)}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Tổng cộng ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                sản phẩm
              </h2>
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toLocaleString("vi-VN")}{" "}
              đ
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Tiến hành thanh toán
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
