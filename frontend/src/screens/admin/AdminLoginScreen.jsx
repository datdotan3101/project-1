import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
// 👇 Nhớ kiểm tra đường dẫn import này chính xác với cấu trúc thư mục của bạn
import { setAdminCredentials } from "../../slices/admin/adminAuthSlice";

const AdminLoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { adminInfo } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    // 👇 NẾU ĐÃ CÓ THÔNG TIN ADMIN -> CHUYỂN NGAY SANG PRODUCT LIST
    if (adminInfo) {
      navigate("/admin/dashboard"); // 👈 Quan trọng: Phải sửa dòng này!
    }
  }, [navigate, adminInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      dispatch(setAdminCredentials(data));
      toast.success("Đăng nhập Admin thành công!");
      // Sau khi dispatch, biến adminInfo thay đổi -> useEffect ở trên sẽ tự chạy -> Chuyển trang
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Đăng nhập thất bại"
      );
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Row className="w-100 justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-lg">
            <Card.Header className="bg-dark text-white text-center py-4">
              <h3 className="mb-0">Admin Portal</h3>
            </Card.Header>
            <Card.Body className="p-5">
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-4" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email admin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="p-3"
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="p-3"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="dark" type="submit" size="lg">
                    Đăng nhập
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLoginScreen;
