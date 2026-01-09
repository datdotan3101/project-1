import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3">
            <p>ProShop &copy; {currentYear}</p>

            <div style={{ fontSize: "10px", opacity: 0.5 }}>
              <Link
                to="/admin/login"
                className="text-decoration-none text-secondary"
              >
                Admin Access
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
export default Footer;
