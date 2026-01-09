import { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus, FaUndo } from "react-icons/fa"; // Thêm icon FaUndo
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const pageNumberParam = pageNumber || 1;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [categories, setCategories] = useState([]); // List danh mục từ DB

  // 👇 State để kiểm soát chế độ nhập (Dropdown hay Text)
  const [isNewCategory, setIsNewCategory] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    image: "",
    brand: "",
    category: "",
    countInStock: 0,
    description: "",
    ram: "",
    storage: "",
    color: "",
    os: "",
    screenSize: "",
    origin: "",
  });

  const { adminInfo } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/products?pageNumber=${pageNumberParam}`
        );
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [refetch, pageNumberParam]);

  const handleShow = () => {
    setShowModal(true);
    setIsNewCategory(false); // Reset về dropdown mỗi khi mở modal
  };
  const handleClose = () => setShowModal(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 👇 Hàm xử lý riêng cho Dropdown Category
  const handleCategoryChange = (e) => {
    if (e.target.value === "NEW_CATEGORY_OPTION") {
      setIsNewCategory(true); // Chuyển sang chế độ nhập tay
      setFormData({ ...formData, category: "" }); // Reset giá trị để nhập mới
    } else {
      setIsNewCategory(false);
      setFormData({ ...formData, category: e.target.value });
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formDataImage = new FormData();
    formDataImage.append("image", file);
    try {
      const res = await axios.post("/api/upload", formDataImage, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, image: res.data.image });
      toast.success("Upload ảnh thành công");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lỗi upload ảnh");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingCreate(true);
      const config = {
        headers: { Authorization: `Bearer ${adminInfo.token}` },
      };
      await axios.post("/api/products", formData, config);
      toast.success("Tạo sản phẩm thành công!");
      setLoadingCreate(false);
      setShowModal(false);
      setRefetch(!refetch);
      // Reset form
      setFormData({
        name: "",
        price: 0,
        image: "",
        brand: "",
        category: "",
        countInStock: 0,
        description: "",
        ram: "",
        storage: "",
        color: "",
        os: "",
        screenSize: "",
        origin: "",
      });
    } catch (error) {
      setLoadingCreate(false);
      toast.error(error.response?.data?.message || "Tạo thất bại");
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${adminInfo.token}` },
        });
        toast.success("Đã xóa");
        setRefetch(!refetch);
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Sản phẩm</h1>
        </Col>
        <Col className="text-end">
          <LinkContainer to="/admin/orderlist">
            <Button className="my-3 me-2" variant="info">
              📋 Quản lý Đơn hàng
            </Button>
          </LinkContainer>
          <Button className="my-3" onClick={handleShow}>
            <FaPlus /> Tạo sản phẩm
          </Button>
        </Col>
      </Row>

      {loading ? (
        <h2>Đang tải...</h2>
      ) : (
        <>
          <Table striped hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>TÊN</th>
                <th>GIÁ</th>
                <th>DANH MỤC</th>
                <th>THƯƠNG HIỆU</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              {(products.products || products).map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{Number(product.price).toLocaleString("vi-VN")}đ</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm mx-1">
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm mx-1"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <FaTrash style={{ color: "white" }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate
            pages={pages}
            page={page}
            isAdmin={true}
            listType="product"
          />
        </>
      )}

      {/* --- MODAL --- */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
              <Form.Control
                type="file"
                onChange={uploadFileHandler}
                className="mt-2"
              />
            </Form.Group>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* 👇 Ô DANH MỤC THÔNG MINH (DROPDOWN + NHẬP MỚI) */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  {isNewCategory ? (
                    // 🅰️ Giao diện khi nhập mới
                    <div className="d-flex">
                      <Form.Control
                        type="text"
                        name="category"
                        placeholder="Nhập tên danh mục mới..."
                        value={formData.category}
                        onChange={handleChange}
                        autoFocus
                      />
                      <Button
                        variant="outline-secondary"
                        className="ms-2"
                        onClick={() => setIsNewCategory(false)}
                        title="Quay lại danh sách"
                      >
                        <FaUndo />
                      </Button>
                    </div>
                  ) : (
                    // 🅱️ Giao diện Dropdown
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleCategoryChange}
                      required
                    >
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option disabled>──────────</option>
                      <option
                        value="NEW_CATEGORY_OPTION"
                        className="fw-bold text-primary"
                      >
                        + Nhập danh mục mới...
                      </option>
                    </Form.Select>
                  )}
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tồn kho</Form.Label>
                  <Form.Control
                    type="number"
                    name="countInStock"
                    value={formData.countInStock}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <h6 className="text-primary mt-3">Thông số kỹ thuật</h6>
            <Row>
              <Col md={4}>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="RAM"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Bộ nhớ"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Màu sắc"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="OS"
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Màn hình"
                  name="screenSize"
                  value={formData.screenSize}
                  onChange={handleChange}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Xuất xứ"
                  name="origin"
                  value={formData.origin}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2"
              >
                Hủy
              </Button>
              <Button variant="primary" type="submit" disabled={loadingCreate}>
                Lưu sản phẩm
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <LinkContainer to="/admin/dashboard">
        <Button variant="light" className="mb-3">
          &larr; Quay lại Dashboard
        </Button>
      </LinkContainer>
    </>
  );
};

export default ProductListScreen;
