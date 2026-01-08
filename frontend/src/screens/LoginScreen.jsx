import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Lấy params redirect từ URL (ví dụ: ?redirect=/shipping)
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Nếu đã login rồi thì chuyển hướng ngay
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Gọi API đăng nhập
      const { data } = await axios.post("/api/users/login", {
        email,
        password,
      });

      // Lưu vào Redux
      dispatch(setCredentials(data));

      // Toast báo thành công
      toast.success("Đăng nhập thành công!");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="justify-content-md-center container">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Đăng nhập</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2">
              Đăng nhập
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              Chưa có tài khoản?{" "}
              <Link
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Đăng ký ngay
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default LoginScreen;
