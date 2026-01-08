import { useEffect, useState } from "react"; // Thêm useState
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Form,
  InputGroup,
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { clearCartItems, saveCoupon, removeCoupon } from "../slices/cartSlice"; // Import action mới

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState(""); // State ô nhập

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  // 👇 HÀM XỬ LÝ ÁP DỤNG COUPON
  const applyCouponHandler = async () => {
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }
    try {
      const { data } = await axios.post("/api/coupons/validate", {
        couponCode,
      });
      dispatch(saveCoupon(data)); // Lưu vào Redux
      toast.success(
        `Áp dụng mã ${data.code} giảm ${data.discount}% thành công!`
      );
      setCouponCode("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Mã không hợp lệ");
    }
  };

  // 👇 HÀM XỬ LÝ XÓA COUPON
  const removeCouponHandler = () => {
    dispatch(removeCoupon());
    toast.info("Đã hủy mã giảm giá");
  };

  const placeOrderHandler = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
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
          // Có thể gửi thêm coupon code lên server để lưu lịch sử nếu muốn
          couponCode: cart.coupon ? cart.coupon.code : "",
        },
        config
      );

      dispatch(clearCartItems());
      // Xóa luôn coupon sau khi đặt thành công
      dispatch(removeCoupon());
      navigate(`/order/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Row>
        <Col md={8}>
          {/* ... (Phần Vận chuyển, Thanh toán, Sản phẩm giữ nguyên) ... */}
          <ListGroup variant="flush">
            {/* Copy lại code cũ của anh ở đây */}
            <ListGroup.Item>
              <h2>Sản phẩm đặt mua</h2>
              {/* ... */}
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

              {/* 👇 HIỂN THỊ DÒNG GIẢM GIÁ */}
              <ListGroup.Item>
                <Row>
                  <Col>
                    Giảm giá {cart.coupon ? `(${cart.coupon.discount}%)` : ""}
                  </Col>
                  <Col>
                    -{Number(cart.discountAmount || 0).toLocaleString("vi-VN")}đ
                  </Col>
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

              {/* 👇 Ô NHẬP COUPON */}
              <ListGroup.Item>
                {cart.coupon ? (
                  <div className="d-grid">
                    <Button variant="danger" onClick={removeCouponHandler}>
                      Bỏ mã {cart.coupon.code} (-{cart.coupon.discount}%)
                    </Button>
                  </div>
                ) : (
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Nhập mã giảm giá"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                    />
                    <Button
                      variant="outline-primary"
                      onClick={applyCouponHandler}
                    >
                      Áp dụng
                    </Button>
                  </InputGroup>
                )}
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
