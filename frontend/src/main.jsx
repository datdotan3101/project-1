import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// 👇 Import 2 dòng này vào
import { Provider } from "react-redux";
import store from "./store.js";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import CartScreen from "./screens/CartScreen.jsx";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import PlaceOrderScreen from "./screens/PlaceOrderScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import OrderHistoryScreen from "./screens/OrderHistoryScreen.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomeScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      {/* Route Cart đã thêm trước đó, nếu chưa có thì thêm vào: */}
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/profile" element={<ProfileScreen />} />
      <Route path="/profile/orders" element={<OrderHistoryScreen />} />
      <Route path="/shipping" element={<ShippingScreen />} />
      <Route path="/payment" element={<PaymentScreen />} />
      <Route path="/placeorder" element={<PlaceOrderScreen />} />
      <Route path="/order/:id" element={<OrderScreen />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 👇 Bọc App bằng Provider và truyền store vào */}
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
