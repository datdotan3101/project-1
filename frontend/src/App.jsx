import { useEffect } from "react"; // 👈 Nhớ import useEffect
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

// 👇 Import Redux
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "./slices/cartSlice";

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  // 🟢 LOGIC 1: Khi đổi User (Login/Logout) -> Load giỏ hàng riêng của User đó
  useEffect(() => {
    if (userInfo) {
      // Nếu đã đăng nhập: Tìm giỏ hàng có tên "cart_IDUser"
      const savedCart = localStorage.getItem(`cart_${userInfo._id}`);
      if (savedCart) {
        // Nếu tìm thấy -> Nạp vào Redux
        dispatch(setCart(JSON.parse(savedCart)));
      } else {
        // Nếu chưa có (User mới) -> Reset về rỗng
        dispatch(
          setCart({
            cartItems: [],
            shippingAddress: {},
            paymentMethod: "PayPal",
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,
          })
        );
      }
    } else {
      // Nếu là khách vãng lai (Logout): Tìm giỏ hàng chung "cart"
      const savedGuestCart = localStorage.getItem("cart");
      if (savedGuestCart) {
        dispatch(setCart(JSON.parse(savedGuestCart)));
      } else {
        dispatch(
          setCart({
            cartItems: [],
            shippingAddress: {},
            paymentMethod: "PayPal",
            itemsPrice: 0,
            shippingPrice: 0,
            taxPrice: 0,
            totalPrice: 0,
          })
        );
      }
    }
  }, [userInfo, dispatch]);

  // 🟠 LOGIC 2: Khi Giỏ hàng thay đổi -> Tự động lưu vào đúng hộp của User đó
  useEffect(() => {
    if (userInfo) {
      // Nếu đang đăng nhập -> Lưu vào hộp riêng "cart_IDUser"
      localStorage.setItem(`cart_${userInfo._id}`, JSON.stringify(cart));
    } else {
      // Nếu là khách -> Lưu vào hộp chung "cart"
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, userInfo]);

  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
