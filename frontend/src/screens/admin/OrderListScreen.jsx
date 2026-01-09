import { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom"; // Import useParams
import Paginate from "../../components/Paginate"; // Import Paginate component

const OrderListScreen = () => {
  const { pageNumber } = useParams();
  const pageNumberParam = pageNumber || 1; // Default to page 1

  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  const { adminInfo } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const config = {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
        };
        // Pass pageNumber to the API call
        const { data } = await axios.get(
          `/api/orders?pageNumber=${pageNumberParam}`,
          config
        );

        // Update state with paginated data
        setOrders(data.orders);
        setPage(data.page);
        setPages(data.pages);

        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [adminInfo, refetch, pageNumberParam]); // Re-run when pageNumberParam changes

  const deliverHandler = async (id) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };
      await axios.put(`/api/orders/${id}/deliver`, {}, config);
      toast.success("Đã cập nhật trạng thái: Đã giao hàng");
      setRefetch(!refetch);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Quản lý Đơn hàng</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/admin/productlist">
            <Button className="my-3" variant="primary">
              📦 Quản lý Sản phẩm
            </Button>
          </LinkContainer>
        </Col>
      </Row>

      {loading ? (
        <h2>Đang tải...</h2>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>KHÁCH HÀNG</th>
                <th>NGÀY ĐẶT</th>
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
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{Number(order.totalPrice).toLocaleString("vi-VN")}đ</td>

                  <td>
                    {order.isPaid ? (
                      <span className="text-success">
                        Paid {order.paidAt.substring(0, 10)}
                      </span>
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>

                  <td>
                    {order.isDelivered ? (
                      <span className="text-success">
                        Đã giao {order.deliveredAt.substring(0, 10)}
                      </span>
                    ) : (
                      <Button
                        variant="warning"
                        className="btn-sm"
                        onClick={() => deliverHandler(order._id)}
                      >
                        Xác nhận giao
                      </Button>
                    )}
                  </td>

                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Chi tiết
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination Component */}
          <Paginate pages={pages} page={page} isAdmin={true} listType="order" />
        </>
      )}

      <LinkContainer to="/admin/dashboard">
        <Button variant="light" className="mb-3">
          &larr; Quay lại Dashboard
        </Button>
      </LinkContainer>
    </>
  );
};

export default OrderListScreen;
