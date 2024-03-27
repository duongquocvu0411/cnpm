import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Order = () => {
  const [showBillModal, setShowBillModal] = useState(false);
  const [billModalContent, setBillModalContent] = useState("");
  
  const [showMenu, setShowMenu] = useState(false);
  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tables, setTables] = useState([]);
  const [dvts, setDvts] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [tableOrders, setTableOrders] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchDvts();
    fetchMenuItems();
    fetchDvts();
    fetchTables();
   
  }, []);
  const fetchDvts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/dvts`);
      setDvts(response.data);
    } catch (error) {
      console.error('Fetch dvts error:', error);
    }
  };
  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/foods`);
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/tablefoods`);
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables', error);
    }
  };

 // Ví dụ này chỉ giảm số lượng. Bạn có thể thêm logic để xoá món hoàn toàn nếu cần
 const handleRemoveOrder = (name, unitId) => {
  const orderKey = `${name}_${unitId}`;
  if (selectedTable && tableOrders[selectedTable.id] && tableOrders[selectedTable.id][orderKey]) {
    setTableOrders(prevTableOrders => {
      const updatedOrders = { ...prevTableOrders[selectedTable.id] };
      if (updatedOrders[orderKey].quantity > 1) {
        updatedOrders[orderKey].quantity -= 1;
      } else {
        delete updatedOrders[orderKey]; // Remove the item if quantity is 1
      }
      return { ...prevTableOrders, [selectedTable.id]: updatedOrders };
    });
  }
};

const calculateTotalPrice = (tableId) => {
  const orders = tableOrders[tableId] || {};
  let newTotal = 0;
  Object.values(orders).forEach(order => {
    newTotal += order.price * order.quantity;
  });
  setTotalPrice(newTotal);
};
useEffect(() => {
  if (selectedTable) {
    calculateTotalPrice(selectedTable.id);
  }
}, [tableOrders, selectedTable]);
  const handleAddOrder = (itemName, price, unitId) => {
    const orderKey = `${itemName}_${unitId}`;
    const newOrder = { name: itemName, price: price, quantity: 1, unitId };
    let updatedOrders = { ...tableOrders[selectedTable.id] };
  
    if (updatedOrders[orderKey]) {
      updatedOrders[orderKey].quantity += 1; // Tăng số lượng nếu món đã tồn tại
    } else {
      updatedOrders[orderKey] = newOrder; // Thêm món mới nếu chưa có
    }
  
    // Cập nhật lại state cho tableOrders
    setTableOrders({ ...tableOrders, [selectedTable.id]: updatedOrders });
  
    calculateTotalPrice(selectedTable.id);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setShowMenu(true);
    // Tính tổng giá dựa trên đơn hàng của bàn được chọn
    calculateTotalPrice(table.id);
  };
  
  
  const handleCloseModal = () => setShowModal(false);

  // lấy danh sách table
  const handleConfirmOpenTable = async () => {
    if (selectedTable) {
      try {
        // Cập nhật trạng thái của bàn từ 'Có Người' thành 'Trống'
        await axios.put(`${process.env.REACT_APP_API_URL}/api/tablefoods/${selectedTable.id}`, { status: 'Trống' });
        
        // Cập nhật lại danh sách bàn sau khi cập nhật thành công
        fetchTables();
        
        // Hiển thị thông báo thành công và thực hiện các bước khác cần thiết
        alert(`Table ${selectedTable.number} has been successfully reopened!`);
        setShowMenu(false);
        setSelectedTable(null); // Reset selected table
        setOrders([]);
        setTotalPrice(0);
      } catch (error) {
        console.error('Error reopening table', error);
        alert('Failed to reopen table. Please try again.');
      }
    } else {
      alert('No table selected.');
    }
  };
  
  // hiển thị modal thông báo muốn đăng xuất hay k
  const handleLogout = () => {
    // Hiển thị modal xác nhận logout khi người dùng nhấp vào nút Logout
    setShowLogoutModal(true);
};

// đăng xuất
const confirmLogout = () => {
  setShowLogoutModal(false);
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('idEmployee');
  navigate('/');
};
// const handleCheckout = async () => {

//   if (!selectedTable || Object.keys(tableOrders[selectedTable.id] || {}).length === 0) {
//     alert('Please select a table and add some orders first.');
//     return;
//   }
//   // Giả định ta có ID của bill mới tạo
//   let idBill; // ID này cần được lấy sau khi tạo bill thành công
//   // Tạo bill mới trước (giả định URL /api/bills tồn tại và hoạt động)
//   try {
//     const billResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/bills`, {
//       // Dữ liệu cần thiết để tạo bill
//       idTable: selectedTable.id,
//       status: 1, // hoặc trạng thái phù hợp
//       // Các trường khác nếu cần
//     });
//     idBill = billResponse.data.id; // Lấy ID của bill mới tạo
//   } catch (error) {
//     console.error('Error creating bill:', error);
//     alert('Failed to create bill. Please try again.');
//     return;
//   }
//   // Lưu danh sách đơn hàng vào billinfo
//   try {
//     const orders = Object.values(tableOrders[selectedTable.id] || {});
//     await Promise.all(orders.map(order =>
//       axios.post(`${process.env.REACT_APP_API_URL}/api/billinfo`, {
//         idBill: idBill,
//         idFood: order.id, // Giả định mỗi order có ID của food
//         count: order.quantity,
//       })
//     ));

//     alert(`Checkout successful. Total Price: $${totalPrice}.`);
//     // Reset trạng thái sau khi thành công
//     setTableOrders({ ...tableOrders, [selectedTable.id]: {} });
//     setShowMenu(false);
//     setOrders([]);
//     setTotalPrice(0);
//     setSelectedTable(null);
//     fetchTables(); // Cập nhật danh sách bàn
//   } catch (error) {
//     console.error('Error during saving order details:', error);
//     alert('Failed to save order details. Please try again.');
//   }
// };

// checkkout

// trở về màn hình table
const handleReturnTable = () => {
  // Chỉ đơn giản là ẩn menu hiện tại và trở về phần chọn bàn
  setShowMenu(false);
  setSelectedTable(null); // Bỏ chọn bàn hiện tại
};
const handleCheckout = async () => {
  if (!selectedTable || Object.keys(tableOrders[selectedTable.id] || {}).length === 0) {
    alert('Vui lòng chọn một bảng và thêm một số đơn hàng trước.');
    return;
  }

  const dateCheckOut = new Date().toISOString();
  const idEmployee = localStorage.getItem('idEmployee');

  if (!idEmployee) {
    alert('Xin vui lòng đăng nhập để tiến hành thanh toán.');
    return;
  }

  const dateCheckIn = localStorage.getItem(`DateCheckIn_${selectedTable.id}`);

  try {
    const formattedDateCheckIn = dateCheckIn ? dateCheckIn.replace('T', ' ').substring(0, 19) : null;
    const formattedDateCheckOut = dateCheckOut.replace('T', ' ').substring(0, 19);

    const billResponse = await axios.post(`${process.env.REACT_APP_API_URL}/api/bills`, {
      idTable: selectedTable.id,
      status: '',
      DateCheckIn: formattedDateCheckIn,
      DateCheckOut: formattedDateCheckOut,
      idEmployee,
    });
    const idBill = billResponse.data.id;

    const orders = Object.values(tableOrders[selectedTable.id] || {});
    const idFoods = orders.map(order => order.unitId);
    const count = orders.reduce((total, order) => total + (order.price * order.quantity), 0);

    await axios.post(`${process.env.REACT_APP_API_URL}/api/billinfo`, {
      idBill: idBill,
      idFood: JSON.stringify(idFoods),
      count: count,
    });

    await axios.put(`${process.env.REACT_APP_API_URL}/api/tablefoods/${selectedTable.id}`, { status: 'Trống' });
    fetchTables();

    alert(`Thanh toán thành công. Tổng giá: $${totalPrice}.`);

    setTableOrders({ ...tableOrders, [selectedTable.id]: {} });
    setSelectedTable(null);
    setShowMenu(false);
    setTotalPrice(0);
    fetchTables();
  } catch (error) {
    console.error('Lỗi khi thanh toán:', error);
    alert('Không thể tiếp tục thanh toán. Vui lòng thử lại.');
  }
};
// booktable
const handleBookTable = async () => {
  if (selectedTable) {
    try {
     // Lấy ngày và giờ hiện tại
  const currentDate = new Date().toISOString();
  
  // Lưu trữ currentDate như là DateCheckIn vào localStorage hoặc state
  localStorage.setItem(`DateCheckIn_${selectedTable.id}`, currentDate);
      // Gửi yêu cầu book table với thông tin thời gian book
      await axios.put(`${process.env.REACT_APP_API_URL}/api/tablefoods/${selectedTable.id}`, {
        status: 'Có Người', // Trạng thái 'Có Người' cho table
        bookedAt: currentDate // Thời gian book
      });

      // Refresh tables để hiển thị cập nhật
      fetchTables();
      
      alert(`Table ${selectedTable.number} Đặt bàn thành công!`);
      setShowMenu(false);
      setSelectedTable(null); // Reset selected table
    } catch (error) {
      console.error('Lỗi khi đặt bàn:', error);
      alert('Không thể đặt bàn. Vui lòng thử lại!!!!');
    }
  } else {
    alert('Chưa chọn bàn!!');
  }
};
  // seach tên món
  const handleSearch = (event) => {
    setSearchKeyword(event.target.value);
  };
  
  // xóa món ăn đã order
  const handleDeleteAllOrders = () => {
    if (selectedTable) {
      // Update tableOrders by removing orders for the selected table
      const updatedTableOrders = { ...tableOrders, [selectedTable.id]: {} };
      setTableOrders(updatedTableOrders);
  
      // Set the total price to zero
      setTotalPrice(0);
    }
  };
  // const handlePrintBill = () => {
  //   if (selectedTable && tableOrders[selectedTable.id]) {
  //     const billItems = Object.values(tableOrders[selectedTable.id]).map(order => 
  //       `${order.name} x ${order.quantity} - $${order.price * order.quantity}`
  //     ).join('\n');
  
  //     const billText = `
  //       Home Cafe
  //       ID Bàn: ${selectedTable.id}
  //       Danh sách món đã đặt:
  //       ${billItems}
  //       Tổng tiền: $${totalPrice}
  //       Cảm ơn bạn đã ghé thăm!
  //     `;
  
  //     // Update the state to show the modal and set its content
  //     setBillModalContent(billText);
  //     setShowBillModal(true);
  //   } else {
  //     alert("No table selected or no orders to print.");
  //   }
  // };

  const handlePrintBill = () => {
    if (selectedTable && tableOrders[selectedTable.id]) {
      const billItems = Object.values(tableOrders[selectedTable.id]).map(order => 
        `
          ${order.name}  ${order.quantity} - $${order.price * order.quantity}
         `
      ).join('');

      const billText = `
          Home Cafe
          ID Bàn: ${selectedTable.id}
          Danh sách món đã đặt:
          ${billItems}
          Tổng tiền:
          $${totalPrice}
          Cảm ơn bạn đã ghé thăm!
        
      `;
  
      // Update the state to show the modal and set its content
      setBillModalContent(billText);
      setShowBillModal(true);
    } else {
      alert("No table selected or no orders to print.");
    }
  };
  
  
  const filteredMenu = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const renderTableSelection = () => (
    <Row>
      {tables.map((table) => (
       <Col key={table.id} md={4} className="mb-3">
          <Button
            variant={table.status === 'Có Người' ? 'danger' : 'success'}
            onClick={() => handleTableSelect(table)}
          >
            Table {table.number} - {table.status}
          </Button>
        </Col>
      ))}
    </Row>
  );
  
  const renderMenu = () => (
    <Row>
    <Col md={8}>
    <h2>Order List</h2>
    {/* Đã sửa: Lấy orders từ tableOrders dựa vào ID của bàn được chọn */}
    {selectedTable && Object.values(tableOrders[selectedTable.id] || {}).length === 0 ? (
      <p>No orders yet.</p>
    ) : (
      Object.values(tableOrders[selectedTable.id] || {}).map((order, index) => (
        <div key={`${order.name}_${order.unitId}_${index}`} className="d-flex justify-content-between align-items-center mb-2">
          {`${order.name} x ${order.quantity} ${dvts.find(dvt => dvt.id === order.unitId)?.name || 'N/A'} - $${order.price * order.quantity}`}
          <Button variant="danger" onClick={() => handleRemoveOrder(order.name, order.unitId)}>Remove</Button>
        </div>
      ))
    )}
    <h4>Total Price: ${totalPrice}</h4>
    {showMenu && (
      <Row className="mt-3">
        <Col>
          <Button variant="danger" onClick={handleDeleteAllOrders}>Delete All Orders</Button>
          <Button variant="success" onClick={handleCheckout}>Checkout</Button>
          <Button variant="primary" onClick={handleBookTable} className="ml-2">Book Table</Button>
          <Button variant="warning" onClick={handleReturnTable} className="ml-2">Return Table</Button>
          <Button variant="info" onClick={handlePrintBill}>Print Bill</Button>

        </Col>
      </Row>
    )}
  </Col>
      
      <Col md={4}>
        <h2>Menu</h2>
        <Form.Group controlId="formSearch">
          <Form.Control type="text" placeholder="Search menu" value={searchKeyword} onChange={handleSearch} />
        </Form.Group>
        {filteredMenu.map((item, index) => (
          <Card key={index} className="mb-3">
            <Card.Img variant="top" src={`${process.env.REACT_APP_API_URL}/upload/${item.image}`}
                    alt={item.name} 
                    style={{ width: '100px', height: '100px' }}  />
            <Card.Body>
              <Card.Title>{item.name}</Card.Title>
              <Card.Text>Price: ${item.price} / {dvts.find(dvt => dvt.id === item.unitId)?.name || 'N/A'}</Card.Text>
              {/* <Card.Text>Price: ${item.price}</Card.Text> */}
              <Button variant="primary" onClick={() => handleAddOrder(item.name, item.price, item.unitId)}>Add to Order</Button>
            </Card.Body>
          </Card>
        ))}
      </Col>
    </Row>
  );

  return (
    <>
   
    <Container className="mt-5">
    <Modal show={showBillModal} onHide={() => setShowBillModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>Bill Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <pre>{billModalContent}</pre>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowBillModal(false)}>
      Close
    </Button>
  </Modal.Footer>
</Modal>
    {/* <div id="bill-content"> 
      nội dung ở dây 
      </div> */}
      {!showMenu ? renderTableSelection() : renderMenu()}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Table Occupied</Modal.Title>
        </Modal.Header>
        <Modal.Body>This table is currently occupied. Are you sure you want to reopen it?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirmOpenTable}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Button variant="light " onClick={handleLogout} className="mt-3">
        <i className="bi bi-box-arrow-right"></i> Logout
      </Button>
      
      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Logout</h5>
                <button type="button" className="close" onClick={() => setShowLogoutModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to logout?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={confirmLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </Container>
    </>
  );
};

export default Order;
