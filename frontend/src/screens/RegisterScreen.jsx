import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setCredentials } from "../slices/authSlice";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Nếu user đã đăng nhập, chuyển hướng ngay lập tức
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    // 1. Kiểm tra mật khẩu nhập lại có khớp không
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // 2. Gọi API đăng ký
      const { data } = await axios.post("/api/users", {
        name,
        email,
        password,
      });

      // 3. Đăng ký xong thì tự động đăng nhập luôn
      dispatch(setCredentials(data));

      toast.success("Đăng ký thành công!");
      navigate(redirect);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <div className="justify-content-md-center container">
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Đăng ký tài khoản</h1>
          <Form onSubmit={submitHandler}>
            {/* Chỉ yêu cầu: Tên, Email, Password */}
            <Form.Group className="my-2" controlId="name">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="password">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-2" controlId="confirmPassword">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu lần nữa"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="mt-2">
              Đăng ký
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              Đã có tài khoản?{" "}
              <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                Đăng nhập
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterScreen;
