import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import axios from "axios";

const HomeScreen = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      // Gọi API backend thông qua proxy đã cấu hình
      const { data } = await axios.get("/api/products");
      setProducts(data.products); // Lưu ý: API của mình trả về { products, page, pages }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <h1>Sản phẩm mới nhất</h1>
      <Row>
        {products.map((product) => (
          // Hiển thị 1 dòng 4 sản phẩm (màn hình lớn), 3 (vừa), 2 (nhỏ), 1 (điện thoại)
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <Product product={product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
