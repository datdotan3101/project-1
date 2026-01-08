import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Alert } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux"; // 👈 1. Bổ sung Import này

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);

  // 👇 2. Lấy thông tin User để lấy Token
  const { userInfo } = useSelector((state) => state.auth);

  const BANK_INFO = {
    bankName: "MB BANK (Quân Đội)",
    accountNumber: "9999999999",
    accountName: "NGUYEN VAN A",
    branch: "Chi nhánh Hà Nội",
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // 👇 3. Cấu hình Header chứa Token (BẮT BUỘC)
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        // Gửi kèm config vào request
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
      } catch (error) {
        console.error("Lỗi tải đơn hàng:", error);
      }
    };

    // Chỉ gọi API khi đã có userInfo
    if (userInfo) {
      fetchOrder();
    }
  }, [orderId, userInfo]);

  if (!order) return <h2 className="text-center my-5">Đang tải đơn hàng...</h2>;

  return (
    <>
      <h1>Đơn hàng: {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Vận chuyển</h2>
              <p>
                <strong>Tên: </strong> {order.user?.name}
              </p>
              <p>
                <strong>Email: </strong> {order.user?.email}
              </p>
              <p>
                <strong>Địa chỉ: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Alert variant="success">
                  Đã giao hàng lúc {order.deliveredAt}
                </Alert>
              ) : (
                <Alert variant="danger">Chưa giao hàng</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Thanh toán</h2>
              <p>
                <strong>Phương thức: </strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Alert variant="success">
                  Đã thanh toán lúc {order.paidAt}
                </Alert>
              ) : (
                <Alert variant="danger">Chưa thanh toán</Alert>
              )}
            </ListGroup.Item>

            {/* 👇 HIỂN THỊ THÔNG TIN CHUYỂN KHOẢN NẾU CHƯA THANH TOÁN 👇 */}
            {!order.isPaid &&
              order.paymentMethod === "Chuyển khoản ngân hàng" && (
                <ListGroup.Item>
                  <Alert variant="info">
                    <h4>Thông tin chuyển khoản:</h4>
                    <p>
                      Ngân hàng: <strong>{BANK_INFO.bankName}</strong>
                    </p>
                    <p>
                      Số tài khoản: <strong>{BANK_INFO.accountNumber}</strong>
                    </p>
                    <p>
                      Chủ tài khoản: <strong>{BANK_INFO.accountName}</strong>
                    </p>
                    <p>
                      Nội dung CK: <strong>THANHTOAN {order._id}</strong>
                    </p>
                    <hr />
                    <small>
                      *Sau khi chuyển khoản, vui lòng liên hệ Admin để xác nhận.
                    </small>
                  </Alert>
                </ListGroup.Item>
              )}

            <ListGroup.Item>
              <h2>Sản phẩm</h2>
              <ListGroup variant="flush">
                {order.orderItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}>
                        <Image src={item.image} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        {item.qty} x {item.price.toLocaleString("vi-VN")}đ ={" "}
                        {(item.qty * item.price).toLocaleString("vi-VN")}đ
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Cột Tổng tiền */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Tổng đơn hàng</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tiền hàng</Col>
                  <Col>{order.itemsPrice?.toLocaleString("vi-VN")}đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Phí Ship</Col>
                  <Col>{order.shippingPrice?.toLocaleString("vi-VN")}đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Thuế</Col>
                  <Col>{order.taxPrice?.toLocaleString("vi-VN")}đ</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tổng cộng</Col>
                  <Col>
                    <strong>
                      {order.totalPrice?.toLocaleString("vi-VN")}đ
                    </strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
