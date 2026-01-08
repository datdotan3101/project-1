import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("Chuyển khoản ngân hàng");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    // Nếu chưa nhập địa chỉ thì đá về trang shipping
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <div className="container">
      <h1>Phương thức thanh toán</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Chọn phương thức</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              className="my-2"
              label="Chuyển khoản ngân hàng (Vietcombank/MB...)"
              id="BankTransfer"
              name="paymentMethod"
              value="Chuyển khoản ngân hàng"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

            <Form.Check
              type="radio"
              className="my-2"
              label="Thanh toán khi nhận hàng (COD)"
              id="COD"
              name="paymentMethod"
              value="COD"
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Tiếp tục
        </Button>
      </Form>
    </div>
  );
};

export default PaymentScreen;
