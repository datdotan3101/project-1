import { Pagination } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

// pages: Tổng số trang
// page: Trang hiện tại
// isAdmin: Để biết đường dẫn là admin
// keyword: Dùng cho tìm kiếm (nếu có), ở đây ta dùng để phân biệt loại list
const Paginate = ({ pages, page = false, listType = "product" }) => {
  // Logic tạo đường dẫn dựa trên listType
  const getLink = (x) => {
    if (listType === "product") {
      return `/admin/productlist/${x + 1}`;
    } else if (listType === "order") {
      return `/admin/orderlist/${x + 1}`;
    }
    return "/";
  };

  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer key={x + 1} to={getLink(x)}>
            <Pagination.Item active={x + 1 === page}>{x + 1}</Pagination.Item>
          </LinkContainer>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;
