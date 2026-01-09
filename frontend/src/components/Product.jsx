import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded h-100 shadow-sm">
      {" "}
      {/* h-100 để thẻ luôn cao bằng nhau */}
      <Link to={`/product/${product._id}`}>
        {/* 👇 1. Xử lý Ảnh: Cố định chiều cao và dùng object-cover */}
        <Card.Img
          src={product.image}
          variant="top"
          style={{ height: "200px", objectFit: "cover" }}
        />
      </Link>
      <Card.Body className="d-flex flex-column">
        {" "}
        {/* Flex column để đẩy nội dung */}
        <Link to={`/product/${product._id}`} className="text-decoration-none">
          <Card.Title as="div" className="product-title">
            {/* 👇 2. Tên sản phẩm sẽ được xử lý bởi class 'product-title' */}
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div" className="my-2">
          <Rating
            value={product.rating}
            text={`${product.numReviews} đánh giá`}
          />
        </Card.Text>
        {/* mt-auto giúp đẩy giá tiền xuống đáy thẻ nếu nội dung trên ngắn */}
        <Card.Text as="h3" className="mt-auto">
          {product.price.toLocaleString("vi-VN")} đ
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
