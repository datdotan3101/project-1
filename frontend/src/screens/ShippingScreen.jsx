import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  // Nếu đã có địa chỉ trong Redux thì điền sẵn
  const [address, setAddress] = useState(shippingAddress?.address || "");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    // Lưu vào Redux
    dispatch(saveShippingAddress({ address }));
    // Chuyển sang bước chọn thanh toán
    navigate("/payment");
  };

  return (
    <div className="justify-content-md-center container">
      <h1>Địa chỉ giao hàng</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Địa chỉ</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập số nhà, tên đường..."
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-2">
          Tiếp tục
        </Button>
      </Form>
    </div>
  );
};

export default ShippingScreen;
