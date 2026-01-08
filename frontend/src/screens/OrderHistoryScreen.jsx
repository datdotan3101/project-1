import { useState, useEffect } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaTimes, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const OrderHistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        const { data } = await axios.get("/api/orders/myorders", config);
        setOrders(data);
      } catch (error) {
        console.log(error);
        toast.error("Không thể tải lịch sử đơn hàng");
      }
    };

    if (userInfo) {
      fetchMyOrders();
    } else {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  return (
    <>
      <Row className="align-items-center my-3">
        <Col>
          {/* 👇 Nút Quay lại theo yêu cầu của anh */}
          <Link to="/profile" className="btn btn-light">
            <FaArrowLeft /> Quay lại Hồ sơ
          </Link>
        </Col>
      </Row>

      <h2>Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NGÀY MUA</th>
              <th>TỔNG TIỀN</th>
              <th>THANH TOÁN</th>
              <th>GIAO HÀNG</th>
              <th>CHI TIẾT</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice.toLocaleString("vi-VN")}đ</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className="btn-sm" variant="light">
                      Xem
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderHistoryScreen;
