import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap"; // 👈 Thêm NavDropdown
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux"; // 👈 Import Redux
import { useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice"; // 👈 Import action logout
// import { resetCart } from "../slices/cartSlice";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth); // 👈 Lấy thông tin user

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const logoutHandler = () => {
    dispatch(logout()); // Xóa user khỏi Redux & LocalStorage
    navigate("/login"); // Quay về trang login
    // dispatch(resetCart());
  };

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>ProShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Giỏ hàng
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>

              {/* 👇 LOGIC HIỂN THỊ NGƯỜI DÙNG 👇 */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  {/* Link 1: Chỉ vào Hồ sơ */}
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Hồ sơ cá nhân</NavDropdown.Item>
                  </LinkContainer>

                  {/* Link 2: Vào trang Đơn hàng riêng */}
                  <LinkContainer to="/profile/orders">
                    <NavDropdown.Item>Đơn hàng của tôi</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={logoutHandler}>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Đăng nhập
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
