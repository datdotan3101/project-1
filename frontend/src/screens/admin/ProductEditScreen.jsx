import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const ProductEditScreen = () => {
  const { id: productId } = useParams();

  // State thông tin cơ bản
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  // State thông số kỹ thuật
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [color, setColor] = useState("");
  const [os, setOs] = useState("");
  const [screenSize, setScreenSize] = useState("");
  const [origin, setOrigin] = useState("");

  const [loading, setLoading] = useState(true);

  // 👇 State lưu danh sách Category lấy từ DB
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const { adminInfo } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    // 1. Fetch thông tin sản phẩm cần sửa
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${productId}`);

        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);

        setRam(data.ram);
        setStorage(data.storage);
        setColor(data.color);
        setOs(data.os);
        setScreenSize(data.screenSize);
        setOrigin(data.origin);

        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    // 👇 2. Fetch danh sách Category gợi ý
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
    fetchCategories();
  }, [productId]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message);
      setImage(res.data.image);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminInfo.token}`,
        },
      };

      await axios.put(
        `/api/products/${productId}`,
        {
          name,
          price,
          image,
          brand,
          category,
          description,
          countInStock,
          ram,
          storage,
          color,
          os,
          screenSize,
          origin,
        },
        config
      );

      toast.success("Cập nhật sản phẩm thành công");
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.error);
    }
  };

  return (
    <Container>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Quay lại
      </Link>

      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>Chỉnh sửa / Thêm sản phẩm</h1>
          {loading ? (
            <h2>Đang tải dữ liệu...</h2>
          ) : (
            <Form onSubmit={submitHandler}>
              <h5 className="mb-3 text-primary">1. Thông tin cơ bản</h5>

              <Form.Group controlId="name" className="my-2">
                <Form.Label>Tên sản phẩm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="price" className="my-2">
                    <Form.Label>Giá (VNĐ)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Nhập giá"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="countInStock" className="my-2">
                    <Form.Label>Số lượng trong kho</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Nhập số lượng"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="image" className="my-2">
                <Form.Label>Hình ảnh</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập url hình ảnh"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
                <Form.Control
                  type="file"
                  label="Chọn file"
                  onChange={uploadFileHandler}
                  className="mt-2"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group controlId="brand" className="my-2">
                    <Form.Label>Thương hiệu</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="VD: Apple, Samsung"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* 👇 CẬP NHẬT: Ô NHẬP DANH MỤC CÓ GỢI Ý (DATALIST) */}
                <Col md={6}>
                  <Form.Group controlId="category" className="my-2">
                    <Form.Label>Danh mục</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Chọn hoặc nhập mới"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                      list="category-options-edit" // 👈 Link tới ID datalist
                    />
                    <datalist id="category-options-edit">
                      {categories.map((cat, index) => (
                        <option key={index} value={cat} />
                      ))}
                    </datalist>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group controlId="description" className="my-2">
                <Form.Label>Mô tả sản phẩm</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập mô tả"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <h5 className="mt-4 mb-3 text-primary">2. Thông số kỹ thuật</h5>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="ram" className="my-2">
                    <Form.Label>RAM</Form.Label>
                    <Form.Control
                      type="text"
                      value={ram}
                      onChange={(e) => setRam(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="storage" className="my-2">
                    <Form.Label>Bộ nhớ</Form.Label>
                    <Form.Control
                      type="text"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="screenSize" className="my-2">
                    <Form.Label>Màn hình</Form.Label>
                    <Form.Control
                      type="text"
                      value={screenSize}
                      onChange={(e) => setScreenSize(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="os" className="my-2">
                    <Form.Label>Hệ điều hành</Form.Label>
                    <Form.Control
                      type="text"
                      value={os}
                      onChange={(e) => setOs(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="color" className="my-2">
                    <Form.Label>Màu sắc</Form.Label>
                    <Form.Control
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="origin" className="my-2">
                    <Form.Label>Xuất xứ</Form.Label>
                    <Form.Control
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button type="submit" variant="primary" className="my-4 w-100">
                Lưu / Cập nhật Sản phẩm
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductEditScreen;
