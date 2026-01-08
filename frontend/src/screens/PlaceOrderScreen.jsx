import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. Lấy state từ Redux (PHẢI KHAI BÁO Ở ĐÂY)
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); // 👈 Đưa lên đây là chuẩn

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      // Chuẩn bị Header chứa Token
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`, // Lấy token từ biến userInfo đã khai báo ở trên
        },
      };

      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        config
      );

      // Xóa giỏ hàng sau khi đặt thành công
      dispatch(clearCartItems());

      // Chuyển hướng sang trang chi tiết đơn hàng
      navigate(`/order/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Vận chuyển</h2>
              <p>
                <strong>Địa chỉ: </strong>
                {cart.shippingAddress.address},
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Thanh toán</h2>
              <strong>Phương thức: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Sản phẩm đặt mua</h2>
              {cart.cartItems.length === 0 ? (
                <p>Giỏ hàng trống</p>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item._id}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price.toLocaleString("vi-VN")}đ ={" "}
                          {(item.qty * item.price).toLocaleString("vi-VN")}đ
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Tổng đơn hàng</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tiền hàng</Col>
                  <Col>{Number(cart.itemsPrice).toLocaleString("vi-VN")}đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Phí Ship</Col>
                  <Col>
                    {Number(cart.shippingPrice).toLocaleString("vi-VN")}đ
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Thuế (VAT)</Col>
                  <Col>{Number(cart.taxPrice).toLocaleString("vi-VN")}đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tổng cộng</Col>
                  <Col>
                    <strong>
                      {Number(cart.totalPrice).toLocaleString("vi-VN")}đ
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Đặt hàng
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
