import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaBox, FaClipboardList, FaUsers, FaChartLine } from "react-icons/fa"; // Import Icon cho đẹp

const AdminDashboardScreen = () => {
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Chào mừng quay trở lại trang quản trị.</p>
        </Col>
      </Row>

      <Row>
        {/* 👇 CARD 1: QUẢN LÝ SẢN PHẨM */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FaBox size={40} className="text-primary" />
              </div>
              <Card.Title>Sản phẩm</Card.Title>
              <Card.Text>
                Xem danh sách, tạo mới, chỉnh sửa giá và cập nhật tồn kho.
              </Card.Text>
              <LinkContainer to="/admin/productlist">
                <Button variant="outline-primary" className="w-100">
                  Quản lý Sản phẩm
                </Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* 👇 CARD 2: QUẢN LÝ ĐƠN HÀNG */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FaClipboardList size={40} className="text-success" />
              </div>
              <Card.Title>Đơn hàng</Card.Title>
              <Card.Text>
                Xem đơn hàng mới, xác nhận thanh toán và trạng thái giao hàng.
              </Card.Text>
              <LinkContainer to="/admin/orderlist">
                <Button variant="outline-success" className="w-100">
                  Quản lý Đơn hàng
                </Button>
              </LinkContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* 👇 CARD 3: QUẢN LÝ USER (Dự phòng cho tương lai) */}
        <Col md={4} className="mb-4">
          <Card className="shadow-sm h-100" style={{ opacity: 0.6 }}>
            <Card.Body className="text-center">
              <div className="mb-3">
                <FaUsers size={40} className="text-secondary" />
              </div>
              <Card.Title>Người dùng</Card.Title>
              <Card.Text>
                Quản lý danh sách khách hàng và tài khoản quản trị viên.
              </Card.Text>
              <Button variant="outline-secondary" className="w-100" disabled>
                Sắp ra mắt
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 👇 Khu vực Thống kê nhanh (Placeholder) */}
      <Row className="mt-4">
        <Col>
          <Card className="bg-light text-dark">
            <Card.Body>
              <h4 className="d-flex align-items-center">
                <FaChartLine className="me-2" /> Thống kê nhanh
              </h4>
              <p>Hệ thống đang hoạt động ổn định.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboardScreen;
