import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // 1. Khởi tạo giá trị ngay lập tức từ Redux
  // Vì userInfo đã có sẵn (do load từ LocalStorage), nên useState sẽ lấy được luôn giá trị này.
  const [name, setName] = useState(userInfo?.name || "");
  const [email] = useState(userInfo?.email || "");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ❌ ĐÃ XÓA useEffect set name/email ở đây vì không cần thiết nữa.
  // Khi anh cập nhật Profile thành công, anh đã nhập tên mới vào ô Input rồi,
  // nên State 'name' lúc đó đã đúng, không cần Redux nhắc lại nữa.

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
    } else {
      try {
        // Sau này sẽ gọi API update profile ở đây
        toast.success("Cập nhật thông tin thành công (Demo)");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2>Hồ sơ người dùng</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name" className="my-2">
            <Form.Label>Tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="my-2">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email"
              value={email}
              disabled
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Đổi mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="confirmPassword">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            Cập nhật
          </Button>

          <Link to="/profile/orders" className="btn btn-outline-dark ms-2 my-2">
            Xem lịch sử đơn hàng
          </Link>
        </Form>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
